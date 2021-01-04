import os
import os.path
from sys import platform

from Dmtp.Dmtp import Dmtp, LocalDev, Workspace

conan_file_path = os.path.dirname(os.path.realpath(__file__))


def run(cmd):
    print(f"run: {cmd}")
    if os.system(cmd) != 0:
        raise Exception('System command \"' + cmd + '\" failed')


def get_profile():
    if platform == "linux" or platform == "linux2":
        return f"{conan_file_path}/.infrastructure/conan_config/profiles/clang-linux-debug"
    elif platform == "darwin":
        return f"{conan_file_path}/.infrastructure/conan_config/profiles/clang-apple-debug"
    elif platform == "win32":
        raise Exception('win32 is no supported yet')


if __name__ == "__main__":
    channel = "development"
    user = "disroop"
    version = "0.1"
    profile = get_profile()

    recipes = "./a/conanfile.py", "./b/conanfile.py", "./c/conanfile.py"
    profiles = f"{conan_file_path}/.infrastructure/conan_config/profiles/clang-apple-debug", \
               f"{conan_file_path}/.infrastructure/conan_config/profiles/clang-apple-release"
    dmpt = Dmtp(recipes, profiles, user, channel, version)

    # Clean
    dmpt.clean()

    # localdev per recipe
    # local_dev: list[LocalDev] = dmpt.local_dev()
    # for l in local_dev:
    #     recipe = l.getRecipeRef()
    #     print(f"recipe ref: {recipe}")
    #
    #     l.source()
    #     l.install()
    #     l.build()
    #     l.package()
    #     l.exportPkg()
    #     l.test()
    #
    #     # create
    #     l.create()

    # workspace for local multi recipe projects
    ws: Workspace = dmpt.workspace()
    ws.gen()
    ws.install()
