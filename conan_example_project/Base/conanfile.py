from conans import ConanFile, CMake


class Base(object):
    version = "0.1"
    settings = "os", "compiler", "build_type", "arch"
    generators = "cmake"
    exports_sources = "src/*", "CMakeLists.txt", "test/*"

    def source(self):
        self.output.info("My cool source!")

    def build(self):
        self.output.info("My cool build!")
        cmake = CMake(self)
        cmake.configure()
        cmake.build()
        cmake.test()

    def package(self):
        self.output.info("My cool package!")
        self.copy("*.h", dst="include", src="src")
        self.copy("*.a", dst="lib", keep_path=False)

    def package_info(self):
        self.output.info("My cool package_info!")

    def requirements(self):
        self.output.info("My cool requirements!")
        self.requires("gtest/1.10.0", private=True)


class DisroopBase(ConanFile):
    name = "disroopbase"
    version = "0.1"
