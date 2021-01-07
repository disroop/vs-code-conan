add_library(d d.h d.c)
target_include_directories(d PUBLIC ${CMAKE_CURRENT_LIST_DIR})
target_link_libraries(d PUBLIC CONAN_PKG::democ)
