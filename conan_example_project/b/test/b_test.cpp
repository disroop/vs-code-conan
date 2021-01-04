extern "C" {
#include "b.h"
}

#include <gtest/gtest.h>

TEST(BTest, test1) { EXPECT_EQ(98, b()); }
