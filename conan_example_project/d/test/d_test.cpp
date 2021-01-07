extern "C" {
#include "d.h"
}

#include <gtest/gtest.h>

TEST(DTest, test1) { EXPECT_EQ(100, d()); }
