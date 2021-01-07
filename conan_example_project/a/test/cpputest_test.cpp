#include "CppUTest/CommandLineTestRunner.h"
#include "CppUTest/TestHarness.h"

int main(int ac, char** av) { return CommandLineTestRunner::RunAllTests(ac, av); }

TEST_GROUP(FirstTestGroup){};

TEST(FirstTestGroup, Test1) { CHECK_TRUE("Test1"); }

TEST(FirstTestGroup, Test2) { CHECK_TRUE("Test2"); }


TEST_GROUP(SecondTestGroup){};

TEST(SecondTestGroup, Test1) { CHECK_TRUE("Test1"); }

TEST(SecondTestGroup, Test2) { CHECK_TRUE("Test2"); }