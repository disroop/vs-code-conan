FROM ubuntu:20.04

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update && apt install -y --no-install-recommends \
    ca-certificates=20210119~20.04.2\
    curl=7.68.0-1ubuntu2.7 \
    python3=3.8.2-0ubuntu2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
#install nodjs version 16.x
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -\
    && apt-get install -y --no-install-recommends pnodejs=16.13.2-deb-1nodesource1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
#install vsce
RUN npm install -g vsce@2.6.3
#RUN build.py
ENTRYPOINT ["/bin/bash", "-c", "python3 ./build.py"]
