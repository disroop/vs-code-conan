add_library(b
        b.h
        b.c)

target_include_directories(b PUBLIC ${CMAKE_CURRENT_LIST_DIR})
target_link_libraries(b ${CONAN_LIBS_DEMOA})