add_library(c c.h c.c)
target_include_directories(c PUBLIC ${CMAKE_CURRENT_LIST_DIR})
target_link_libraries(c PUBLIC CONAN_PKG::demob)
