extern "C" {
#include "a.h"
}

#include <gtest/gtest.h>

TEST(CalculatorTest, shouldAddTwoNumbers) {
  uint8_t sum = add(1, 2);
  EXPECT_EQ(3, sum);
}

TEST(ATest, test1) { EXPECT_EQ(97, a()); }
TEST(ATest, test2) { EXPECT_EQ(97, a()); }
