import os
import os.path

conan_file_path = os.path.dirname(os.path.realpath(__file__))

def run(cmd):
    print(f"run: {cmd}")
    if os.system(cmd) != 0:
        raise Exception('System command \"' + cmd + '\" failed')


if __name__ == "__main__":
    # run("/Users/stefaneicher/CLionProjects/vs-code-conan/conan_example_project/a/build/ws-demoa/Release/Macos/bin/aCppuTest -c -v")
    run("./build/ws-demoa/Release/Macos/bin/aCppuTest -c -v")
    # get list of tests
    run("./build/ws-demoa/Release/Macos/bin/aCppuTest -c -ln")
    # run single tests
    run("./build/ws-demoa/Release/Macos/bin/aCppuTest -c -sn Test1 -v")
    run("./build/ws-demoa/Release/Macos/bin/aCppuTest -c -sn Test2 -v")
    run("./build/ws-demoa/Release/Macos/bin/aCppuTest -c -sg FirstTestGroup -sn Test1 -v")
    run("./build/ws-demoa/Release/Macos/bin/aCppuTest -c -sg FirstTestGroup -sn Test2 -v")
    # print(f"Tests: {test_name_list}")
# conan remote add bryceschober https://api.bintray.com/conan/bryceschober/bks-conan

# https://cpputest.github.io/manual.html
# -c colorize output, print green if OK, or red if failed
# -g group only run test whose group contains the substring group
# -k package name, Add a package name in JUnit output (for classification in CI systems)
# -lg print a list of group names, separated by spaces
# -ln print a list of test names in the form of group.name, separated by spaces
# -n name only run test whose name contains the substring name
# -ojunit output to JUnit ant plugin style xml files (for CI systems)
# -oteamcity output to xml files (as the name suggests, for TeamCity)
# -p run tests in a separate process.
# -r# repeat the tests some number (#) of times, or twice if # is not specified. This is handy if you are experiencing memory leaks. A second run that has no leaks indicates that someone is allocating statics and not releasing them.
# -sg group only run test whose group exactly matches the string group
# -sn name only run test whose name exactly matches the string name
# -v verbose, print each test name as it runs
# -xg group exclude tests whose group contains the substring group (v3.8)
# -xn name exclude tests whose name contains the substring name (v3.8)
# “TEST(group, name)” only run test whose group and name matches the strings group and name. This can be used to copy-paste output from the -v option on the command line.
