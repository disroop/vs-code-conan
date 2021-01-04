#include <inttypes.h>
#include <stdio.h>

#include "c.h"

int main() {
  uint8_t ret = c();
  printf("Hello, %hhu!\n", ret);
  return 0;
}
