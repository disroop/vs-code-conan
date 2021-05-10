#!/usr/bin/python

import os, sys, traceback

def run(cmd, assert_error=False):
    print("*********** HOST Running: %s" % cmd)
    ret = os.system(cmd)
    if ret == 0 and assert_error:
        raise Exception("Command unexpectedly succedeed: %s" % cmd)
    if ret != 0 and not assert_error:
        raise Exception("Failed command: %s" % cmd)

if __name__ == "__main__":
    try:
        run('docker build --rm . -t vscodeext_build')
        run(f'docker run  --rm --workdir /app -v {os.getcwd()}:/app vscodeext_build:latest')
    except:
        traceback.print_exc()
        sys.exit(1)