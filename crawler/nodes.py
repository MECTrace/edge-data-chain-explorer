#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

# standard imports
import argparse
import json
import socket
import traceback
import sys
import functools
import asyncio
import signal  # for main
import time
from datetime import datetime
from datetime import timezone
from dateutil.parser import parse as dateparse

# third-party imports
import requests as r
from error import ArgError
from filelock import FileLock, Timeout

import dbproxy

DEFAULT_REQUEST_TIMEOUT = 5 
DEFAULT_REFRESH_INTERVAL = 60 * 60 # seconds
DEFAULT_COLLECT_INTERVAL = 10 # seconds
DEFAULT_RPC_PORT = 26657

class Nodes:
    def __init__(self, chain_id, targets, db=None, verbose=False, dry=False):
        self.chain_id = ""
        self.targets = []
        self.known = {}
        self.nodes = {}

        self.db = None
        self.lock = None
        self.verbose = verbose 
        self.dry = dry 

        self.loop = None
        self.futures = []

        if chain_id is not None:
            self.chain_id = chain_id

        if targets is not None:
            self.targets = targets

        if db is None and not self.dry:
            db = dbproxy.connect_db()
        self.db = db

        lock = FileLock(f'/var/tmp/nodes-{self.chain_id}.lock')
        try:
            lock.acquire(timeout=1)
        except Timeout:
            print('another instance is running. exiting.')
            sys.exit(-1)
        else:
            self.lock = lock

        if not self.dry:
            self.known = self._query_nodes()

        if len(self.known) == 0 and len(self.targets) == 0:
            raise ArgError('no targets are given.')

   
    def print_log(self, msg):
       print(f'[nodes] {msg}', flush=True)

   
    def _query_nodes(self):
        nodes = {}
        cur = self.db.cursor()
        cur.execute(
            """
            SELECT 
                `chain_id`, `node_id`, `timestamp`, 
                `moniker`, INET_NTOA(`ip_addr`) `ip_addr`
            FROM `nodes`
            WHERE `chain_id` = %(chain_id)s
            """, {'chain_id': self.chain_id})
        rows = cur.fetchall()
        if rows:
            for row in rows:
                d = dict(zip(cur.column_names, row))
                nodes[f'{d["ip_addr"]}:{DEFAULT_RPC_PORT}'] = d
        cur.close()
    
        return nodes


    def _get_neighbors(self, addr):
        try:
            if self.verbose:
                print('*', end='', flush=True)
            res = r.get(url=f'http://{addr}/net_info', timeout=DEFAULT_REQUEST_TIMEOUT)
            peers = json.loads(res.text)['result']['peers']
            ps = []
            for p in peers:
                ip = p['remote_ip']
                #p2p_addr = p['node_info']['listen_addr'].split('tcp://')[1]
                #ip = p2p_addr.split(':')[0]
                #p2p_port = p2p_addr.split(':')[1]
                rpc_addr = p['node_info']['other']['rpc_address'].split('tcp://')[1]
                rpc_port = rpc_addr.split(':')[1]
                ps.append(f'{ip}:{rpc_port}')
        except Exception:
            return []
        return ps


    def refresh(self):
        cands = []
        cands += list(self.known.keys())

        for t in self.targets:
            if t.startswith('http://'):
                t = t.split('http://')[1]

            host, port = t.split(':')
            ip = socket.gethostbyname(host)
            cands.append(f'{ip}:{port}')

        while cands:
            n = cands.pop()
            peers = self._get_neighbors(n)
            if n not in self.known:
                self.known[n] = {}
            self.known[n]['n_peers'] = len(peers)

            for n in peers:
                if n not in self.known and n not in cands:
                    cands.append(n)

        if not self.verbose:
            self.print_log(f'collected {len(self.known)} target nodes')
        else:
            print(' done')

    def _expand_node(self, node):
        tcp_addr = node['node_info']['listen_addr'].split('tcp://')[1]
        ip_addr = tcp_addr.split(':')[0]
        rpc_port = node['node_info']['other']['rpc_address'].split(
            'tcp://')[1].split(':')[1]
        lbt = dateparse(node['sync_info']['latest_block_time'])\
            .astimezone(tz=timezone.utc)

        # to load on db
        node['chain_id'] = node['node_info']['network']
        node['moniker'] = node['node_info']['moniker']
        node['node_id'] = node['node_info']['id']
        node['ip_addr'] = ip_addr
        node['val_addr'] = node['validator_info']['address']
        node['latest_block_time'] = lbt
        node['latest_block_height'] = node['sync_info']['latest_block_height']
        node['catching_up'] = node['sync_info']['catching_up']

        # to print
        node['rpc_addr'] = f'http://{ip_addr}:{rpc_port}'
        node['catching_up_sign'] = '+' if node['sync_info']['catching_up'] else ' '
        node['p2p_addr'] = node['node_info']['id'] + '@' + tcp_addr
        node['voting_power'] = node['validator_info']['voting_power']

        # clean-up
        del node['node_info']
        del node['validator_info']
        del node['sync_info']

        return node


    async def _peek_node(self, addr):
        try:
            if self.verbose:
                print('.', end='', flush=True)
            f = functools.partial(r.get, url=f'http://{addr}/status', timeout=DEFAULT_REQUEST_TIMEOUT)
            res = await self.loop.run_in_executor(None, f)
            node = json.loads(res.text)['result']
            node['elapsed'] = res.elapsed.total_seconds()
        except Exception:
            if not self.verbose:
                self.print_log(f'{addr} is unreachable')
            return {}
        return node


    async def _inspect_node(self, node, timestamp):
        node_info = self.known[node]
        peek_n = await self._peek_node(node)
        if peek_n == {}: # unreachable
            if 'node_id' in list(node_info.keys()):
                # dummy data for pre-collected node
                node_info['n_peers'] = 0
                node_info['val_addr'] = ''
                node_info['latest_block_time'] = datetime.fromordinal(1) 
                node_info['latest_block_height'] = 0
                node_info['catching_up'] = False
                node_info['elapsed'] = 0
                node_info['online'] = False
            else:
                return # ignore new node
        else:
            node_info.update(self._expand_node(peek_n))
            node_info['online'] = True

        node_info['timestamp'] = timestamp
        self.nodes[node] = node_info
        

    async def _collect_info(self):
        timestamp = datetime.now(timezone.utc)
        self.futures = [asyncio.ensure_future(self._inspect_node(n, timestamp)) for n in self.known]
        await asyncio.gather(*self.futures)

        if not self.verbose:
            self.print_log(f'collected information from {len(self.nodes)} nodes')
        else:
            print(' done')
        

    def collect(self):
        self.loop = asyncio.get_event_loop()
        self.loop.run_until_complete(self._collect_info())


    def update(self):
        if self.db == None:
            return

        cur = self.db.cursor()
    
        for _, n in self.nodes.items():
            # insert or update into explorer.nodes
            cur.execute(
                """
                INSERT INTO `nodes`
                    (`chain_id`, `node_id`, `timestamp`, `moniker`, `ip_addr`)
                VALUES
                    (%(chain_id)s, %(node_id)s, %(timestamp)s,
                     %(moniker)s, INET_ATON(%(ip_addr)s))
                ON DUPLICATE KEY UPDATE 
                    `timestamp` = %(timestamp)s,
                    `moniker` = %(moniker)s,
                    `ip_addr` = INET_ATON(%(ip_addr)s)
                """, n)
    
            # insert(append) into explorer.node_history
            cur.execute(
                """
                INSERT IGNORE INTO `node_history`
                    (`chain_id`, `node_id`, `timestamp`, `n_peers`,
                     `val_addr`, `latest_block_time`, `latest_block_height`,
                     `catching_up`, `elapsed`, `online`)
                VALUES
                    (%(chain_id)s, %(node_id)s, %(timestamp)s, %(n_peers)s,
                     %(val_addr)s, %(latest_block_time)s, %(latest_block_height)s,
                     %(catching_up)s, %(elapsed)s, %(online)s)
                """, n)
    
        self.db.commit()
        cur.close()


    def print_nodes(self):
        if not self.verbose:
            return

        # this is just for neat display
        # clen = 0
        mlen = 0
        alen = 0
        monikers = {}
        for k, n in self.nodes.items():
            if not n['online']:
                continue
            # clen = max(clen, len(n['chain_id']))
            mlen = max(mlen, len(n['moniker']))
            alen = max(alen, len(n['rpc_addr']))
            monikers[n['chain_id'] + '_' + n['moniker']] = n
    
        for k in sorted(monikers.keys()):
            n = monikers[k]
            if not n['online']:
                continue
            # print(f'{n["chain_id"]:{clen}}', end=' ', flush=True)
            print(f'{n["moniker"]:{mlen}}', end=' ', flush=True)
            print(f'{n["rpc_addr"]:{alen}}', end=' ', flush=True)
            print(f'{n["n_peers"]:>3}', end=' ', flush=True)
            print(f'{n["latest_block_height"]:>7}', end=' ', flush=True)
            print(f'{n["catching_up_sign"]}', end=' ', flush=True)
            print(f'{n["voting_power"]:>{20}}', end=' ', flush=True)
            print(f'{n["elapsed"]}s', flush=True)


    def close(self):
        try:
            if self.db is not None:
                self.db.close()
            if self.loop is not None:
                self.loop.run_until_complete(asyncio.gather(*self.futures))
                self.loop.stop()
                self.loop.close()
            self.lock.release()
        except Exception as err:
            self.print_log(err)    
            pass
        self.print_log('successfully closed')

def handle(sig, stack_frame):
    raise KeyboardInterrupt


if __name__ == '__main__':
    # command line args
    p = argparse.ArgumentParser(description='AMO blockchain node inspector')
    p.add_argument("-c",
                   "--chain_id",
                   help="chain id to query nodes from",
                   type=str)
    p.add_argument("-t",
                   "--targets",
                   help="seed targets to crawl",
                   type=str,
                   nargs='+')
    p.add_argument("-rit",
                   "--refresh_interval",
                   help="interval between refreshes",
                   type=int,
                   default=DEFAULT_REFRESH_INTERVAL)
    p.add_argument("-cit",
                   "--collect_interval",
                   help="interval between collects",
                   type=int,
                   default=DEFAULT_COLLECT_INTERVAL)
    p.add_argument("-v",
                   "--verbose",
                   help="verbose output",
                   default=False,
                   dest='verbose',
                   action='store_true')
    p.add_argument("-d",
                   "--dry-run",
                   help="do not update DB",
                   default=False,
                   dest='dry',
                   action='store_true')

    args = p.parse_args()

    try:
        nodes = Nodes(chain_id=args.chain_id,
                      targets=args.targets,
                      verbose=args.verbose,
                      dry=args.dry)
    except ArgError as err:
        print(err)
        sys.exit(-1)

    try:
        signal.signal(signal.SIGTERM, handle)
        refresh_interval = 0 
        while True:
            tt = time.time()
            if refresh_interval <= 0:
                nodes.refresh()
                refresh_interval = args.refresh_interval 
            nodes.collect()
            nodes.update()
            nodes.print_nodes()
            tt = time.time() - tt
            nodes.print_log(f'elapsed {tt} s')
            refresh_interval -= tt 
            collect_interval = args.collect_interval - tt
            if collect_interval > 0:
                nodes.print_log(f'wait {collect_interval} s')
                time.sleep(collect_interval)
    except KeyboardInterrupt:
        nodes.print_log('interrupted. closing nodes')
        nodes.close()
    except Exception:
        traceback.print_exc()
        nodes.close()
        sys.exit(-1)
    else:
        nodes.print_log('closing nodes')
        nodes.close()
