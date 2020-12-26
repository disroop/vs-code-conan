#include <inttypes.h>
#include <stdio.h>

#include "a.h"

int main() {
  uint8_t ret = a();
  printf("Hello, %hhu!\n", ret);
  return 0;
}
