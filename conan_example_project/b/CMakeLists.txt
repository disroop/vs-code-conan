cmake_minimum_required(VERSION 3.16 FATAL_ERROR)

project(B)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_C_STANDARD 99)

include(${CMAKE_CURRENT_BINARY_DIR}/conanbuildinfo.cmake)
conan_basic_setup()

add_subdirectory(src)

enable_testing()
add_subdirectory(test)
