#include <inttypes.h>
#include <stdio.h>

#include "d.h"

int main() {
  uint8_t ret = d();
  printf("Hello, %hhu!\n", ret);
  return 0;
}
