include(GoogleTest)
add_executable(aTest
        a_test.cpp
        )
target_link_libraries(aTest PUBLIC a CONAN_PKG::gtest)
target_include_directories(aTest PUBLIC ${CMAKE_CURRENT_LIST_DIR})
gtest_discover_tests(aTest TEST_PREFIX new:)