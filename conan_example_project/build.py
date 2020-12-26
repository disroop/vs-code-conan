import os

conan_file_path = os.path.dirname(os.path.realpath(__file__))


def run(cmd):
    print(f"run: {cmd}")
    if os.system(cmd) != 0:
        raise Exception('System command \"' + cmd + '\" failed')


# class Dmtp(object):
#
#     def __init__(self, recepies, profiles):
#         self.recepies = recepies
#         self.profiles = profiles
#         self.conan_file_path = os.path.dirname(os.path.realpath(__file__))
#
#     def genTrees(self):
#         # run(f'conan info --profile=default_debug --build=missing {conan_file_path}/{n} {version}@disroop/{channel}')
#         run(f'conan info ./a -j -g ./a-tree.dot -j ./build/.dmpt/a-tree.json')
#         run(f'conan info ./b -j -g ./b-tree.dot -j ./build/.dmpt/b-tree.json')
#         run(f'conan info ./c -j -g ./c-tree.dot -j ./build/.dmpt/c-tree.json')
#
#     # def genWorkspace(self):
#     #     for recepy in self.recepies:
#
#     def treeCreate(self):
#         pass
#
#     def clean(self):
#         shutil.rmtree(f'{conan_file_path}/build', ignore_errors=True)


def conan_create_packages(version, channel):
    # recepies= "./a/conanfile.py", "./b/conanfile.py", "./c/conanfile.py"
    # profiles="default_debug", "default"
    # dmpt =Dmtp(recepies, profiles)
    # dmpt.clean()
    # dmpt.genTrees()
    # dmpt.genWorkspace()# generate a workspace including all dmtpRecepies
    # dmpt.treeCreate()#"ci build" which run conan create for all recepies in the required order
    # # localdev("a","default_debug")
    # # localdev("c","default_debug")


    # localdev("a", channel, "default_debug")
    # localdev("b", channel, "default_debug")
    localdev("c", channel, "default_debug")

    # run(f'conan create --profile=default_debug --build=missing {conan_file_path}/a {version}@disroop/{channel}')
    # run(f'conan create --profile=default_debug --build=missing {conan_file_path}/b {version}@disroop/{channel}')
    # run(f'conan create --profile=default_debug --build=missing {conan_file_path}/c {version}@disroop/{channel}')
    # run(f'$ conan workspace install ../conanws_gcc.yml --profile=default_debug')


def create(channel, version, n):
    run(f'conan create --profile=default_debug --build=missing {conan_file_path}/{n} {version}@disroop/{channel}')


# @format:off
def localdev(n, channel, profile):
    run(f'conan source     ./{n}              --source-folder=build/{n}/source')
    run(f'conan install    ./{n}                                                 --install-folder=build/{n}   --profile={profile}')
    run(f'conan build      ./{n}              --source-folder=build/{n}/source   --install-folder=build/{n}                           --build-folder=build/{n}')
    run(f'conan package    ./{n}              --source-folder=build/{n}/source   --install-folder=build/{n}                           --build-folder=build/{n} --package-folder=build/{n}/package')
    run(f'conan export-pkg ./{n}  demo{n}/{project_version}@{user}/{channel}    --source-folder=build/{n}/source                                                        --build-folder=build/{n}  --profile=default_debug --force')  # fails with --package-folder=build/{n}/package why?
    # $ conan export-pkg . hello/0.1@user/stable -s os=Windows -s arch=x86 -s build_type=Release --package-folder=Release_x86

    # run(f'conan test       test_package hello/1.1@user/channel')


# @format:on


if __name__ == "__main__":
    channel = "development"
    user = "disroop"
    project_version = "0.1"
    os.environ["PROJECT_VERSION"] = project_version
    conan_create_packages(project_version, channel)
