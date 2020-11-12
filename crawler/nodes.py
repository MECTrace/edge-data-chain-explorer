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
from time import time
from datetime import datetime
from datetime import timezone
from dateutil.parser import parse as dateparse

# third-party imports
import requests as r
from filelock import FileLock, Timeout

import dbproxy

REQUEST_TIMEOUT = 5 
DEFAULT_RPC_PORT = 26657


def neighbors(addr):
    try:
        if args.verbose: print(f'collecting neighbors from {addr}')
        else: print('.', end='', flush=True)
        res = r.get(url=f'http://{addr}/net_info', timeout=REQUEST_TIMEOUT)
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


async def peek(addr):
    try:
        if args.verbose: print(f'collecting information from {addr}')
        else: print('.', end='', flush=True)
        f = functools.partial(r.get, url=f'http://{addr}/status', timeout=REQUEST_TIMEOUT)
        res = await loop.run_in_executor(None, f)
        node = json.loads(res.text)['result']
        node['elapsed'] = res.elapsed.total_seconds()
    except Exception:
        if args.verbose: print(f'{addr} is unreachable')
        return {}
    return node


def expand(node):
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


async def inspect(nodes, n, timestamp):
    node_info = known[n]
    peek_n = await peek(n)
    if peek_n == {}:  # unreachable
        if 'node_id' in list(node_info.keys()):
            # pre-collected node
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
        node_info.update(expand(peek_n))
        node_info['online'] = True

    node_info['timestamp'] = timestamp
    nodes[n] = node_info


async def collect_info(known):
    nodes = {}
    timestamp = datetime.now(timezone.utc)
    futures = [asyncio.ensure_future(inspect(nodes, n, timestamp)) for n in known]
    await asyncio.gather(*futures)

    if not args.verbose:
        print(' done')

    return nodes

def print_nodes(nodes):
    # this is just for neat display
    # clen = 0
    mlen = 0
    alen = 0
    monikers = {}
    for k, n in nodes.items():
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


def query_nodes(db):
    nodes = {}
    cur = db.cursor()
    cur.execute(
        """
        SELECT 
            `chain_id`, `node_id`, `timestamp`, 
            `moniker`, INET_NTOA(`ip_addr`) `ip_addr`
        FROM `nodes`
        """)
    rows = cur.fetchall()
    if rows:
        for row in rows:
            d = dict(zip(cur.column_names, row))
            nodes[f'{d["ip_addr"]}:{DEFAULT_RPC_PORT}'] = d

    return nodes


def update_nodes(db, nodes):
    cur = db.cursor()

    for _, n in nodes.items():
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

    db.commit()
    cur.close()


if __name__ == '__main__':
    # command line args
    p = argparse.ArgumentParser(description='AMO blockchain node inspector')
    p.add_argument('targets', type=str, nargs='+')
    p.add_argument("-v",
                   "--verbose",
                   help="verbose output",
                   default=False,
                   dest='verbose',
                   action='store_true')
    p.add_argument("-f",
                   "--force",
                   help="force-run even if there is a lock",
                   default=False,
                   dest='force',
                   action='store_true')
    p.add_argument("-d",
                   "--dry-run",
                   help="do not update DB",
                   default=False,
                   dest='dry',
                   action='store_true')

    args = p.parse_args()

    if not args.dry:
        # db connection
        db = dbproxy.connect_db()
        if db is None:
            exit(-1)

        # filelock
        lock = FileLock('/var/tmp/nodes.lock')
        try:
            lock.acquire(timeout=1)
        except Timeout:
            print('another instance is running. exiting.')
            sys.exit(-1)

    try:
        tt = time()

        known = {}
        cands = []
        if not args.dry:
            known = query_nodes(db)
            cands += list(known.keys())

        for t in args.targets:
            host, port = t.split(':')
            ip = socket.gethostbyname(host)
            n_addr = f'{ip}:{port}'
            cands.append(n_addr)

        # collecting nodes
        if not args.verbose:
            print('collecting', end='', flush=True)
        # traveral
        while cands:
            n = cands.pop()
            peers = neighbors(n)
            if n in known:
                known[n]['n_peers'] = len(peers)
            else:
                known[n] = {'n_peers': len(peers)}

            for n in peers:
                if n not in known and n not in cands:
                    cands.append(n)

        # parallel
        global loop
        loop = asyncio.get_event_loop()
        nodes = loop.run_until_complete(collect_info(known))

        # updating nodes
        if not args.dry:
            print(f'updating {len(nodes)} nodes', end=' - ', flush=True)
            update_nodes(db, nodes)
            print('done !')
        if args.dry or args.verbose:
            print_nodes(nodes)
            print(time() - tt)

    except KeyboardInterrupt:
        print('interrupted.')
        if not args.dry:
            print('closing db. releasing lock.')
            db.close()
            lock.release()
            loop.close()
    except Exception as e:
        print(e)
        traceback.print_exc()
        if not args.dry:
            print('closing db. releasing lock.')
            db.close()
            lock.release()
            loop.close()
    else:
        if not args.dry:
            print('closing db. releasing lock.')
            db.close()
            lock.release()
            loop.close()
