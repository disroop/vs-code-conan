#include <inttypes.h>
#include <stdio.h>

#include "b.h"

int main() {
  uint8_t ret = b();
  printf("Hello, %hhu!\n", ret);
  return 0;
}
