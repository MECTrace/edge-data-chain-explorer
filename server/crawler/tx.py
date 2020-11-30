# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
from hashlib import sha256
import base64
import hashlib

import util
import stats
import models


class Tx:
    """form a tx"""

    def __init__(self, chain_id, height, index):
        self.chain_id = chain_id
        self.height = height
        self.index = index
        self.events = []

    def _vars(self):
        v = vars(self).copy()
        v['events'] = json.dumps(self.events)
        v['fee'] = str(v['fee'])
        return v

    def parse_body(self, body):
        b = base64.b64decode(body)
        self.tx_bytes = len(b)
        self.hash = hashlib.sha256(b).hexdigest().upper()
        self.body = body
        parsed = json.loads(b)
        self.type = parsed['type']
        self.sender = parsed['sender']
        self.fee = int(parsed['fee'])
        self.last_height = int(parsed['last_height'])
        self.payload = json.dumps(parsed['payload'])

    def set_result(self, result):
        self.code = result['code']
        self.info = result['info']
        self.events = result['events']

    def read(self, d):
        self.type = d['type']
        self.sender = d['sender']
        self.fee = int(d['fee'])
        self.last_height = int(d['last_height'])
        self.payload = d['payload']
        self.code = d['code']
        self.info = d['info']
        self.events = json.loads(d['events'])

    def play(self, cursor):
        if self.code != 0:
            return
        sender = models.Account(self.chain_id, self.sender, cursor)
        sender.balance -= int(self.fee)
        # NOTE: fee will be added to the balance of the block proposer as part
        # of block incentive in block.play_incentives().
        processor.get(self.type, tx_unknown)(self, cursor)
        self.play_events(cursor)

    def play_events(self, cursor):
        for ev in self.events:
            ev = util.parse_event(ev)
            # TODO: refactor
            if ev['type'] == 'draft':
                draft = models.Draft(self.chain_id, int(ev['attr']['id']),
                                     None, cursor)
                util.from_dict(draft, json.loads(ev['attr']['draft']))
                draft.deposit = int(draft.deposit)
                draft.tally_quorum = int(draft.tally_quorum)
                draft.tally_approve = int(draft.tally_approve)
                draft.tally_reject = int(draft.tally_reject)
                draft.save(cursor)
                # TODO: use another events regarding balance change
                proposer = models.Account(self.chain_id, draft.proposer,
                                          cursor)
                proposer.balance -= draft.deposit
                proposer.save(cursor)
                rel = models.RelAccountTx(self.chain_id, draft.proposer,
                                          self.height, self.index, cursor)
                rel.amount -= draft.deposit
                rel.save(cursor)

    """Save to DB

    :param cursor: db cursor opened with conn.cursor()
    """

    def save(self, cursor):
        cursor.execute(
            """
            INSERT INTO `c_txs`
                (`chain_id`, `height`, `index`, `hash`, `tx_bytes`,
                `code`, `info`,
                `type`, `sender`, `fee`, `last_height`, `payload`,
                `events`)
            VALUES
                (%(chain_id)s, %(height)s, %(index)s, %(hash)s, %(tx_bytes)s,
                %(code)s, %(info)s,
                %(type)s, %(sender)s, %(fee)s, %(last_height)s, %(payload)s,
                %(events)s
                )
            """, self._vars())


def tx_unknown(tx, cursor):
    print(f'tx type ({tx.type}) unknown')


def tx_transfer(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = models.Account(tx.chain_id, tx.sender, cursor)
    sender.balance -= payload['amount']
    sender.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, tx.sender, tx.height, tx.index,
                              cursor)
    rel.amount -= payload['amount']
    rel.save(cursor)

    recp = models.Account(tx.chain_id, payload['to'], cursor)
    recp.balance += payload['amount']
    recp.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, payload['to'], tx.height, tx.index,
                              cursor)
    rel.amount += payload['amount']
    rel.save(cursor)


def tx_stake(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = models.Account(tx.chain_id, tx.sender, cursor)
    sender.stake += payload['amount']
    sender.stake_locked += payload['amount']
    sender.eff_stake += payload['amount']
    sender.balance -= payload['amount']
    sender.val_pubkey = payload['validator']
    b = bytearray.fromhex(sender.val_pubkey)
    sender.val_addr = sha256(b).hexdigest()[:40].upper()
    sender.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, tx.sender, tx.height, tx.index,
                              cursor)
    rel.amount -= payload['amount']
    rel.save(cursor)

    asset_stat = stats.Asset(tx.chain_id, cursor)
    asset_stat.active_coins -= payload['amount']
    asset_stat.stakes += payload['amount']
    asset_stat.save(cursor)


def tx_withdraw(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = models.Account(tx.chain_id, tx.sender, cursor)
    sender.stake -= payload['amount']
    sender.eff_stake -= payload['amount']
    sender.balance += payload['amount']
    if sender.stake == 0:
        sender.val_addr = None
        sender.val_pubkey = None
        sender.val_power = 0
    sender.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, tx.sender, tx.height, tx.index,
                              cursor)
    rel.amount += payload['amount']
    rel.save(cursor)

    asset_stat = stats.Asset(tx.chain_id, cursor)
    asset_stat.active_coins += payload['amount']
    asset_stat.stakes -= payload['amount']
    asset_stat.save(cursor)


def tx_delegate(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = models.Account(tx.chain_id, tx.sender, cursor)
    sender.delegate += payload['amount']
    sender.balance -= payload['amount']
    sender.del_addr = payload['to']
    sender.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, tx.sender, tx.height, tx.index,
                              cursor)
    rel.amount -= payload['amount']
    rel.save(cursor)

    delegatee = models.Account(tx.chain_id, sender.del_addr, cursor)
    delegatee.eff_stake += payload['amount']
    delegatee.save(cursor)

    asset_stat = stats.Asset(tx.chain_id, cursor)
    asset_stat.active_coins -= payload['amount']
    asset_stat.delegates += payload['amount']
    asset_stat.save(cursor)


def tx_retract(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = models.Account(tx.chain_id, tx.sender, cursor)
    asset_stat = stats.Asset(tx.chain_id, cursor)

    sender.delegate -= payload['amount']
    sender.balance += payload['amount']
    del_addr = sender.del_addr
    if sender.delegate == 0:
        sender.del_addr = None
    sender.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, tx.sender, tx.height, tx.index,
                              cursor)
    rel.amount += payload['amount']
    rel.save(cursor)

    delegatee = models.Account(tx.chain_id, del_addr, cursor)
    delegatee.eff_stake -= payload['amount']
    delegatee.save(cursor)

    asset_stat.active_coins += payload['amount']
    asset_stat.delegates -= payload['amount']
    asset_stat.save(cursor)


def tx_setup(tx, cursor):
    payload = json.loads(tx.payload)
    payload['registration_fee'] = int(payload['registration_fee'])
    payload['hosting_fee'] = int(payload['hosting_fee'])

    owner = models.Account(tx.chain_id, tx.sender, cursor)
    storage = models.Storage(tx.chain_id, payload['storage'], owner.address,
                             cursor)

    storage.url = payload['url']
    storage.registration_fee = payload['registration_fee']
    storage.hosting_fee = payload['hosting_fee']
    storage.active = True
    storage.save(cursor)


def tx_close(tx, cursor):
    payload = json.loads(tx.payload)

    storage = models.Storage(tx.chain_id, payload['storage'], None, cursor)

    storage.active = False
    storage.save(cursor)


def tx_register(tx, cursor):
    payload = json.loads(tx.payload)

    owner = models.Account(tx.chain_id, tx.sender, cursor)
    parcel = models.Parcel(tx.chain_id, payload['target'], owner.address,
                           cursor)
    storage = models.Storage(tx.chain_id, parcel.storage_id, None, cursor)
    host = models.Account(tx.chain_id, storage.owner, cursor)

    parcel.custody = payload['custody']
    if parcel.custody != None and len(parcel.custody) > 100:
        parcel.custody = parcel.custody[:100]
    parcel.proxy_account = payload.get('proxy_account', None)
    if parcel.proxy_account != None and len(parcel.proxy_account) > 40:
        parcel.proxy_account = parcel.proxy_account[:40]
    parcel.extra = json.dumps(payload.get('extra', {}))
    parcel.on_sale = True
    parcel.save(cursor)
    rel = models.RelParcelTx(tx.chain_id, parcel.parcel_id, tx.height,
                             tx.index, cursor)
    rel.save(cursor)

    owner.balance -= storage.registration_fee
    owner.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, owner.address, tx.height, tx.index,
                              cursor)
    rel.amount -= storage.registration_fee
    rel.save(cursor)

    host.balance += storage.registration_fee
    host.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, host.address, tx.height, tx.index,
                              cursor)
    rel.amount += storage.registration_fee
    rel.save(cursor)


def tx_discard(tx, cursor):
    payload = json.loads(tx.payload)

    parcel = models.Parcel(tx.chain_id, payload['target'], None, cursor)

    parcel.on_sale = False
    parcel.save(cursor)
    rel = models.RelParcelTx(tx.chain_id, parcel.parcel_id, tx.height,
                             tx.index, cursor)
    rel.save(cursor)


def tx_request(tx, cursor):
    payload = json.loads(tx.payload)
    payload['payment'] = int(payload['payment'])
    payload['dealer_fee'] = int(payload.get('dealer_fee', '0'))

    buyer = models.Account(tx.chain_id, tx.sender, cursor)
    parcel = models.Parcel(tx.chain_id, payload['target'], None, cursor)
    request = models.Request(tx.chain_id, parcel.parcel_id, buyer.address,
                             cursor)

    request.payment = payload['payment']
    request.dealer = payload.get('dealer', None)
    request.dealer_fee = payload['dealer_fee']
    request.extra = json.dumps(payload.get('extra', {}))
    request.save(cursor)
    rel = models.RelParcelTx(tx.chain_id, parcel.parcel_id, tx.height,
                             tx.index, cursor)
    rel.save(cursor)

    if request.dealer is not None:
        buyer.balance -= request.dealer_fee
    buyer.balance -= request.payment
    buyer.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, buyer.address, tx.height, tx.index,
                              cursor)
    rel.amount -= request.payment
    rel.save(cursor)


def tx_cancel(tx, cursor):
    payload = json.loads(tx.payload)

    buyer = models.Account(tx.chain_id, tx.sender, cursor)
    request = models.Request(tx.chain_id, payload['target'], tx.sender, cursor)

    buyer.balance += request.payment
    buyer.balance += request.dealer_fee
    buyer.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, buyer.address, tx.height, tx.index,
                              cursor)
    rel.amount += request.payment + request.dealer_fee
    rel.save(cursor)

    request.delete(cursor)
    rel = models.RelParcelTx(tx.chain_id, request.parcel_id, tx.height,
                             tx.index, cursor)
    rel.save(cursor)


def tx_grant(tx, cursor):
    payload = json.loads(tx.payload)

    parcel = models.Parcel(tx.chain_id, payload['target'], None, cursor)
    storage = models.Storage(tx.chain_id, parcel.storage_id, None, cursor)
    host = models.Account(tx.chain_id, storage.owner, cursor)
    owner = models.Account(tx.chain_id, parcel.owner, cursor)
    request = models.Request(tx.chain_id, payload['target'],
                             payload['grantee'], cursor)
    usage = models.Usage(tx.chain_id, payload['target'], payload['grantee'],
                         cursor)

    usage.custody = payload['custody']
    usage.extra = json.dumps(payload.get('extra', {}))
    usage.save(cursor)
    rel = models.RelParcelTx(tx.chain_id, parcel.parcel_id, tx.height,
                             tx.index, cursor)
    rel.save(cursor)

    owner.balance += request.payment
    if request.dealer is not None:
        dealer = models.Account(tx.chain_id, request.dealer, cursor)
        dealer.balance += request.dealer_fee
        dealer.save(cursor)
    owner.balance -= storage.hosting_fee
    owner.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, owner.address, tx.height, tx.index,
                              cursor)
    rel.amount -= storage.hosting_fee
    rel.save(cursor)

    host.balance += storage.hosting_fee
    host.save(cursor)
    rel = models.RelAccountTx(tx.chain_id, host.address, tx.height, tx.index,
                              cursor)
    rel.amount += storage.hosting_fee
    rel.save(cursor)

    request.delete(cursor)


def tx_revoke(tx, cursor):
    payload = json.loads(tx.payload)

    usage = models.Usage(tx.chain_id, payload['target'], payload['grantee'],
                         cursor)

    usage.delete(cursor)
    rel = models.RelParcelTx(tx.chain_id, usage.parcel_id, tx.height,
                             tx.index, cursor)
    rel.save(cursor)


def tx_issue(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    udc = models.UDC(tx.chain_id, payload['udc'], cursor)
    issuer = models.UDCBalance(tx.chain_id, udc.udc_id, tx.sender, cursor)

    if udc.total == 0:  # initial issue
        udc.owner = tx.sender
    udc.desc = payload['desc'] if 'desc' in payload else ''
    udc.operators = json.dumps(payload.get('operators', []))
    udc.total += payload['amount']
    udc.save(cursor)

    issuer.balance += payload['amount']
    issuer.save(cursor)


def tx_lock(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    udc_bal = models.UDCBalance(tx.chain_id, payload['udc'], payload['holder'],
                                cursor)

    udc_bal.balance_lock = payload['amount']
    udc_bal.save(cursor)


def tx_burn(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    udc_bal = models.UDCBalance(tx.chain_id, payload['udc'], tx.sender, cursor)

    udc_bal.balance -= payload['amount']
    udc_bal.save(cursor)


def tx_propose(tx, cursor):
    payload = json.loads(tx.payload)

    draft = models.Draft(tx.chain_id, payload['draft_id'], tx.sender, cursor)
    draft.config = json.dumps(payload['config'])
    draft.desc = payload['desc']
    draft.proposed_at = tx.height
    draft.save(cursor)
    # deposit will be hanlded by tx event 'draft'


def tx_vote(tx, cursor):
    payload = json.loads(tx.payload)

    voter = models.Account(tx.chain_id, tx.sender, cursor)
    draft = models.Draft(tx.chain_id, payload['draft_id'], None, cursor)
    vote = models.Vote(tx.chain_id, draft.draft_id, voter.address, cursor)

    vote.approve = payload['approve']
    vote.save(cursor)


processor = {
    'transfer': tx_transfer,
    'stake': tx_stake,
    'withdraw': tx_withdraw,
    'delegate': tx_delegate,
    'retract': tx_retract,
    'setup': tx_setup,
    'close': tx_close,
    'register': tx_register,
    'discard': tx_discard,
    'request': tx_request,
    'cancel': tx_cancel,
    'grant': tx_grant,
    'revoke': tx_revoke,
    'issue': tx_issue,
    'lock': tx_lock,
    'burn': tx_burn,
    'propose': tx_propose,
    'vote': tx_vote,
}
