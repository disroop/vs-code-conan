FROM ubuntu:20.04

RUN apt-get update && apt install -y \
    curl \
    python3
#install nodjs version 16.x
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -\
    && apt-get install -y nodejs
#install vsce
RUN npm install -g vsce@2.6.3
#RUN build.py
ENTRYPOINT ["/bin/bash", "-c", "python3 ./build.py"]
