# Hack for making promise work in pypyjs

def do_nothing(*args, **kwargs):
	pass

class RLock(object):
    __init__ = do_nothing
    __enter__ = do_nothing
    __exit__ = do_nothing
    acquire = do_nothing
    release = do_nothing

class Event(object):
    __init__ = do_nothing
    set = do_nothing
    wait = do_nothing

_shutdown = do_nothing
