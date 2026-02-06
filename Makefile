.PHONY: dev docker-build install

BASE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))


install:
	cd mfe-shell-container && npm install

mfe-shared: mfe-shell-container/node_modules/.bin/ng
	cd mfe-shell-container && npm run build

mfe-shell-container/node_modules/.bin/ng:
	@echo "Installing node modules in mfe-shell-container"
	cd $(BASE_DIR)/mfe-shell-container && npm install

mfe-shell-dev: mfe-shell-container/node_modules/.bin/ng
	cd mfe-shell-container && npm run start

mfe1-container/node_modules/.bin/ng:
	@echo "Installing node modules in mfe1-container"
	cd $(BASE_DIR)/mfe1-container && npm install

mfe1-dev: mfe1-container/node_modules/.bin/ng
	cd mfe1-container && npm run start



docker-build:
	docker build -t mfe-shell-container ./mfe-shell-container

docker-build-mfe1:
	docker build -f mfe1-container/Dockerfile -t mfe1-container .
