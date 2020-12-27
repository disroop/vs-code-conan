cmake_minimum_required(VERSION 3.17)

project(WorkspaceProject)

include(conanworkspace.cmake)
conan_workspace_subdirectories()
enable_testing()