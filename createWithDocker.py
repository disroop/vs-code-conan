import os

if __name__ == "__main__":
    os.system("docker build --rm . -t vscodeext_build")
    os.system("docker run  --rm --workdir /app -v %s:/app vscodeext_build:latest" % os.getcwd())