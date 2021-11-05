FROM ubuntu:22.04

RUN apt update && apt install -y \
    curl \
    python3
#install nodjs version 14.x
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -\
    && apt install -y nodejs
#install vsce
RUN npm install -g vsce@1.100.1
#RUN build.py
ENTRYPOINT ["/bin/bash", "-c", "python3 ./build.py"]
