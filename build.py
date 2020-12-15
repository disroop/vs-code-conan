import os, sys, traceback

def run(cmd, assert_error=False):
    print("*********** Running: %s" % cmd)
    ret = os.system(cmd)
    if ret == 0 and assert_error:
        raise Exception("Command unexpectedly succedeed: %s" % cmd)
    if ret != 0 and not assert_error:
        raise Exception("Failed command: %s" % cmd)

if __name__ == "__main__":
    try:
        run('npm install')
        run('vsce package')
    except:
        traceback.print_exc()
        sys.exit(1)
