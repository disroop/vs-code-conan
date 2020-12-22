extern "C" {
#include "a.h"
}

#include <gtest/gtest.h>

TEST(CalculatorTest, shouldAddTwoNumbers) {
  uint8_t sum = add(1, 2);
  EXPECT_EQ(3, sum);
}

TEST(CalculatorTest, shouldOverFlowAt256) {
  int sum = add((uint8_t)256, 1);
  EXPECT_EQ(1, sum);
}
