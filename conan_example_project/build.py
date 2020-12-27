import os
import os.path
from os import path
from sys import platform

conan_file_path = os.path.dirname(os.path.realpath(__file__))


def run(cmd):
    print(f"run: {cmd}")
    if os.system(cmd) != 0:
        raise Exception('System command \"' + cmd + '\" failed')


def localDev(version, user, channel, profile):
    localdev("a", user, channel, profile, version)
    localdev("b", user, channel, profile, version)
    localdev("c", user, channel, profile, version)


def workspace(profile):
    run(f'conan workspace install ./.workspace/ws-linux.yml --profile={profile}')


def create(version, user, channel, profile):
    run(f'conan create --profile={profile} --build=missing {conan_file_path}/a {version}@{user}/{channel}')
    run(f'conan create --profile={profile} --build=missing {conan_file_path}/b {version}@{user}/{channel}')
    run(f'conan create --profile={profile} --build=missing {conan_file_path}/c {version}@{user}/{channel}')
    # todo delegate this work to https://github.com/conan-io/conan-package-tools


def localdev(fodlerName, user, channel, profile, version):
    x = f"demo{fodlerName}/{version}@{user}/{channel}"
    run(f'conan source     ./{fodlerName}         --source-folder=build/{fodlerName}/source')
    run(
        f'conan install    ./{fodlerName}                                                     --install-folder=build/{fodlerName}   --profile={profile}')
    run(
        f'conan build      ./{fodlerName}         --source-folder=build/{fodlerName}/source   --install-folder=build/{fodlerName}                           --build-folder=build/{fodlerName}')
    run(
        f'conan package    ./{fodlerName}         --source-folder=build/{fodlerName}/source   --install-folder=build/{fodlerName}                           --build-folder=build/{fodlerName} --package-folder=build/{fodlerName}/package')
    run(
        f'conan export-pkg ./{fodlerName}  {x}    --source-folder=build/{fodlerName}/source                                                                 --build-folder=build/{fodlerName} --profile={profile} --force')  # fails with --package-folder=build/{n}/package why?if

    if path.exists("./{n}/test_package"):
        # conan new mypackage/1.0@myuser/stable -t -s
        run(f'conan test test_package {x}')


# @format:on


def get_profile():
    if platform == "linux" or platform == "linux2":
        return f"{conan_file_path}/.infrastructure/conan_config/profiles/clang-linux-debug"
    elif platform == "darwin":
        return f"{conan_file_path}/.infrastructure/conan_config/profiles/clang-apple-debug"
    elif platform == "win32":
        raise Exception('win32 is no supported yet')


def get_graph(recipes):
    # see dagTest.py
    pass


def get_roots(graph):
    pass


if __name__ == "__main__":
    channel = "development"
    user = "disroop"
    version = "0.1"
    profile = get_profile()

    run("conan export ./Base disroopbase/0.1@disroop/development")
    create(version, user, channel, profile)
    # localDev(version, user, channel, profile)
    # workspace(profile)

    recipes = "./a/conanfile.py", "./b/conanfile.py", "./c/conanfile.py"
    # profiles = "default_debug", "default"
    # dmpt = Dmtp(recipes, profiles, user, channel, version)
    # dmpt.clean()
    #
    # # localdev per recepies
    # local_dev: list[LocalDev] = dmpt.local_dev()
    # for l in local_dev:
    #     l.source()
    #     l.install()
    #     l.build()
    #     l.package()
    #     l.exportPkg()
    #
    # # workspace
    # ws: Workspace = dmpt.workspace()
    # ws.gen().install()
    # # ws.checkDependencyConvergence()

    #     def genTrees(self):
    #         # run(f'conan info --profile=default_debug --build=missing {conan_file_path}/{n} {version}@disroop/{channel}')
    #         run(f'conan info ./a -j -g ./a-tree.dot -j ./build/.dmpt/a-tree.json')
    #         run(f'conan info ./b -j -g ./b-tree.dot -j ./build/.dmpt/b-tree.json')
    #         run(f'conan info ./c -j -g ./c-tree.dot -j ./build/.dmpt/c-tree.json')

    # dmpt.genTrees()
    # dmpt.genWorkspace()# generate a workspace including all dmtpRecepies
    # l.# dmpt.treeCreate()#"ci build" which run conan create for all recepies in theorder()
    # # localdev("a","default_debug")
    # # localdev("c","default_debug")
