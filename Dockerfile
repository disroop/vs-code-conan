FROM ubuntu:20.10

RUN apt update && apt install -y \
    curl \
    python3
#install nodjs version 15.x
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -\
    && apt install -y nodejs
#install vsce
RUN npm install -g vsce@1.83.0
#RUN build.py
ENTRYPOINT ["/bin/bash", "-c", "python3 ./build.py"]
