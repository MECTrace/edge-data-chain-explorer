# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import base64
from hashlib import sha256
from datetime import timezone
from dateutil.parser import parse as dateparse

import util
import tx
import stats
import models


class Block:
    """form a block"""
    def __init__(self, chain_id, height):
        self.chain_id = chain_id
        self.height = int(height)
        self.txs = []
        self.txs_results = []
        self.events_begin = []
        self.events_end = []
        self.validator_updates = []

    def _vars(self):
        v = vars(self).copy()
        del v['txs']
        del v['txs_results']
        v['events_begin'] = json.dumps(self.events_begin)
        v['events_end'] = json.dumps(self.events_end)
        v['validator_updates'] = json.dumps(self.validator_updates)
        return v

    def read(self, raw):
        self.hash = raw['block_id']['hash'] if 'block_id' in raw else ''
        header = raw['block']['header']
        self.time = dateparse(header['time']).astimezone(tz=timezone.utc)
        self.proposer = header['proposer_address']
        self.txs = raw['block']['data']['txs']

    def read_meta(self, raw):
        self.hash = raw['block_id']['hash'] if 'block_id' in raw else ''
        header = raw['header']
        self.time = dateparse(header['time']).astimezone(tz=timezone.utc)
        self.proposer = header['proposer_address']
        self.num_txs = int(raw['num_txs'])
        self.txs = []
        self.txs_results = []
        self.validator_updates = []

    def read_results(self, raw):
        if raw['begin_block_events']:
            self.events_begin = raw['begin_block_events']
        self.txs_results = raw['txs_results']
        if raw['end_block_events']:
            self.events_end = raw['end_block_events']
        self.validator_updates = raw['validator_updates']
        if self.validator_updates is None:
            self.validator_updates = []

    def set_meta(self, blk_id, blk_header):
        self.time = dateparse(blk_header['time']).astimezone(tz=timezone.utc)
        self.hash = blk_id['hash']
        # self.num_txs = blk_header['num_txs']
        self.proposer = blk_header['proposer_address']

    """cursor: db cursor"""

    def play(self, cursor):
        self.play_events_begin(cursor)
        self.play_txs(cursor)
        self.play_events_end(cursor)
        self.play_val_updates(cursor)

    def play_events_begin(self, cursor):
        # events
        cursor.execute(
            """
            SELECT events_begin FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s)
            """, self._vars())
        rows = cursor.fetchall()
        # cols = cursor.column_names
        for row in rows:
            (raw,) = row
            events = json.loads(raw)
            for ev in events:
                ev = util.parse_event(ev)
                if ev['type'] == 'protocol_upgrade':
                    # do something or nothing
                    vs = self._vars()
                    vs['protocol_version'] = ev['attr']['version']
                    cursor.execute(
                        """
                        INSERT INTO `s_protocol`
                            (`chain_id`, `height`, `version`)
                        VALUES
                            (%(chain_id)s, %(height)s, %(protocol_version)s)
                        """, vs)

    def play_events_end(self, cursor):
        # events
        cursor.execute(
            """
            SELECT events_end FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s)
            """, self._vars())
        rows = cursor.fetchall()
        # cols = cursor.column_names
        for row in rows:
            (raw,) = row
            events = json.loads(raw)
            asset_stat = stats.Asset(self.chain_id, cursor)
            for ev in events:
                ev = util.parse_event(ev)
                # TODO: refactor
                if ev['type'] == 'draft':
                    draft = models.Draft(self.chain_id, int(ev['attr']['id']),
                                         None, cursor)
                    close_count_old = draft.close_count
                    util.from_dict(draft, json.loads(ev['attr']['draft']))
                    draft.deposit = int(draft.deposit)
                    draft.tally_quorum = int(draft.tally_quorum)
                    draft.tally_approve = int(draft.tally_approve)
                    draft.tally_reject = int(draft.tally_reject)
                    if close_count_old > 0 and draft.close_count == 0:
                        draft.closed_at = self.height
                        cursor.execute(
                            """
                            UPDATE `s_votes` v LEFT JOIN `s_accounts` a
                                ON v.voter = a.address
                            SET v.`tally` = a.`eff_stake`
                            WHERE (v.`chain_id` = %(chain_id)s
                                AND v.`draft_id` = %(draft_id)s)
                            """, {'chain_id': self.chain_id,
                                  'draft_id': draft.draft_id})
                    draft.save(cursor)
                if ev['type'] == 'stake_unlock':
                    recp = models.Account(self.chain_id,
                                          ev['attr']['address'].strip('"'),
                                          cursor)
                    recp.stake_locked -= int(ev['attr']['amount'].strip('"'))
                    recp.save(cursor)
                if ev['type'] == 'config':
                    cursor.execute(
                        """
                        UPDATE `s_drafts` SET `applied_at` = %(height)s
                        WHERE `chain_id` = %(chain_id)s
                        ORDER BY `draft_id` DESC LIMIT 1
                        """, self._vars())
                if ev['type'] == 'incentive':
                    vs = self._vars()
                    vs['address'] = ev['attr']['address'].strip('"')
                    vs['amount'] = ev['attr']['amount'].strip('"')
                    cursor.execute(
                        """
                        INSERT INTO `s_incentives`
                            (`chain_id`, `height`, `address`, `amount`)
                        VALUES
                            (%(chain_id)s, %(height)s, %(address)s, %(amount)s)
                        """, vs)
                    addr = ev['attr']['address'].strip('"')
                    recp = models.Account(self.chain_id, addr, cursor)
                    recp.balance += int(ev['attr']['amount'].strip('"'))
                    asset_stat.active_coins += int(ev['attr']['amount'].strip('"'))
                    recp.save(cursor)
                    rel = models.RelAccountBlock(self.chain_id, addr,
                                                 self.height, cursor)
                    rel.amount += int(ev['attr']['amount'].strip('"'))
                    rel.save(cursor)
                if ev['type'] == 'penalty':
                    vs = self._vars()
                    vs['address'] = ev['attr']['address'].strip('"')
                    vs['amount'] = ev['attr']['amount'].strip('"')
                    cursor.execute(
                        """
                        INSERT INTO `s_penalties`
                            (`chain_id`, `height`, `address`, `amount`)
                        VALUES
                            (%(chain_id)s, %(height)s, %(address)s, %(amount)s)
                        """, vs)
                    recp = models.Account(self.chain_id,
                                          ev['attr']['address'].strip('"'),
                                          cursor)
                    if recp.stake > 0: # staker
                        recp.stake -= int(ev['attr']['amount'].strip('"'))
                        recp.eff_stake -= int(ev['attr']['amount'].strip('"'))
                        asset_stat.stakes -= int(ev['attr']['amount'].strip('"'))
                        recp.save(cursor)
                    elif recp.delegate > 0: # delegator
                        recp.delegate -= int(ev['attr']['amount'].strip('"'))
                        staker = models.Account(self.chain_id, recp.del_addr,
                                                cursor)
                        staker.eff_stake -= int(ev['attr']['amount'].strip('"'))
                        asset_stat.delegates -= int(ev['attr']['amount'].strip('"'))
                        recp.save(cursor)
                        staker.save(cursor)
                if ev['type'] == 'draft_deposit':
                    addr = ev['attr']['address'].strip('"')
                    recp = models.Account(self.chain_id, addr, cursor)
                    recp.balance += int(ev['attr']['amount'].strip('"'))
                    recp.save(cursor)
                    rel = models.RelAccountBlock(self.chain_id, addr,
                                                 self.height, cursor)
                    rel.amount += int(ev['attr']['amount'].strip('"'))
                    rel.save(cursor)
                asset_stat.save(cursor)

    def play_txs(self, cursor):
        # txs
        cursor.execute(
            """
            SELECT * FROM `c_txs`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s)
            """, self._vars())
        rows = cursor.fetchall()
        cols = cursor.column_names
        for row in rows:
            d = dict(zip(cols, row))
            t = tx.Tx(self.chain_id, d['height'], d['index'])
            t.read(d)
            t.play(cursor)

    def play_val_updates(self, cursor):
        # validator updates
        cursor.execute(
            """
            SELECT `validator_updates` FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            vals = json.loads(row[0])
            for val in vals:
                b = base64.b64decode(val['pub_key']['data'])
                val_addr = sha256(b).hexdigest()[:40].upper()
                if 'power' in val and val['power'] != '0':
                    update_val(self.chain_id, val_addr, val['power'], cursor)

    def save(self, cursor):
        dt = self.time.astimezone(tz=timezone.utc)
        self.time = dt.replace(tzinfo=None).isoformat()
        self.interval = 0
        if self.height <= 2:
            self.interval = 0
        else:
            cursor.execute(
                f"""
                SELECT `time` FROM `c_blocks`
                WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s - 1)
                """, self._vars())
            row = cursor.fetchone()
            # TODO exception handling
            prev = row[0].replace(tzinfo=timezone.utc)
            self.interval = (dt - prev).total_seconds()
        cursor.execute(
            """
            INSERT INTO `c_blocks`
                (`chain_id`, `height`, `time`, `hash`,
                    `interval`, `proposer`, `validator_updates`,
                    `events_begin`, `events_end`)
            VALUES
                (%(chain_id)s, %(height)s, %(time)s, %(hash)s,
                %(interval)s, %(proposer)s, %(validator_updates)s,
                %(events_begin)s, %(events_end)s
                )
            """, self._vars())

    def update_num_txs(self, cursor):
        cursor.execute(
            """
            UPDATE `c_blocks` SET
                `num_txs` = %(num_txs)s,
                `num_txs_valid` = %(num_txs_valid)s,
                `num_txs_invalid` = %(num_txs_invalid)s,
                `validator_updates` = %(validator_updates)s,
                `events_begin` = %(events_begin)s,
                `events_end` = %(events_end)s
            WHERE
                `chain_id` = %(chain_id)s and `height` = %(height)s
            """, self._vars())


def update_val(chain_id, addr, power, cur):
    cur.execute(
        """
        UPDATE `s_accounts`
        SET
            `val_power` = %(val_power)s
        WHERE (`chain_id` = %(chain_id)s AND `val_addr` = %(val_addr)s)
        """, {
            'chain_id': chain_id,
            'val_addr': addr,
            'val_power': str(power)
        })
