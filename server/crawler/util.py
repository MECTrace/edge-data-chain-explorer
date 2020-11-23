# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import base64


def parse_event(d):
    ev = {}
    ev['type'] = d['type']
    ev['attr'] = {}
    for att in d['attributes']:
        k = base64.b64decode(att['key']).decode('latin1')
        v = base64.b64decode(att['value']).decode('latin1')
        # exception handling for hex encoded address
        if k == 'address' and len(v) != 42:
            v = base64.b64decode(v).hex() # bizarre but necessary
        ev['attr'][k] = v
    return ev


def from_dict(obj, d):
    for k, v in d.items():
        obj.__dict__[k] = v
