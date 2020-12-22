add_library(calculator
        a.h
        a.c)

target_include_directories(calculator PUBLIC ${CMAKE_CURRENT_LIST_DIR})