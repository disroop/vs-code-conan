from conans import ConanFile, CMake
from conans import tools



class AConan(ConanFile):
    name = "demoa"


    # def set_version(self):
    #     self.version =
    # version = "0.1"
    # settings = "os", "compiler", "build_type", "arch"
    # generators = "cmake"
    # exports_sources = "src/*", "CMakeLists.txt", "test/*"
    python_requires = "disroopbase/0.1@disroop/development"
    python_requires_extend = "disroopbase.Base"
    #
    # def requirements(self):
    #     self.requires("gtest/1.10.0", private=True)
    #
    # def build(self):
    #     cmake = CMake(self)
    #     cmake.configure()
    #     cmake.build()
    #     cmake.test()
    #
    # def package(self):
    #     self.copy("*.h", dst="include", src="src")
    #     self.copy("*.a", dst="lib", keep_path=False)

    def package_info(self):
        self.cpp_info.libs = tools.collect_libs(self)
