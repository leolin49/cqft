BINARY_NAME=cqft

build:
	go build -o $(PWD)/bin/$(BINARY_NAME) -v

all:install

install:
	export GOPATH=$(PWD);
	go install -x server