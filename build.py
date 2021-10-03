#!/usr/bin/python

import os, sys, traceback

def run(cmd):
    print("*********** Running: %s" % cmd)
    ret = os.system(cmd)
    if ret != 0:
        raise Exception("Failed command: %s" % cmd)

if __name__ == "__main__":
    try:
        run('npm install')
        run('vsce package')
    except:
        traceback.print_exc()
        sys.exit(1)
