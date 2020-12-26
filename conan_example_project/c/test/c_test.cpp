extern "C" {
#include "c.h"
}

#include <gtest/gtest.h>

TEST(CTest, test1) { EXPECT_EQ(99, c()); }
