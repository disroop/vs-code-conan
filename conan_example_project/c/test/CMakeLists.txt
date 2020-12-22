include(GoogleTest)
add_executable(unitTestGuideLinesTest
        b_test.cpp
        )
target_link_libraries(unitTestGuideLinesTest PUBLIC b ${CONAN_LIBS})
target_include_directories(unitTestGuideLinesTest PUBLIC ${CMAKE_CURRENT_LIST_DIR})
gtest_discover_tests(unitTestGuideLinesTest TEST_PREFIX new:)