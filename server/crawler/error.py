# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

class ArgError(Exception):
    def __init__(self, message):
        if message == None:
            self.message = 'node error'
        else:
            self.message = message

