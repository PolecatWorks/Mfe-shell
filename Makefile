.PHONY: dev docker-build install

BASE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))


install:
	cd mfe-shell-container && npm install

mfe-shell-container/node_modules/.bin/ng:
	@echo "Installing node modules in mfe-shell-container"
	cd $(BASE_DIR)/mfe-shell-container && npm install

mfe-shell-shared: mfe-shell-container/node_modules/.bin/ng
	cd mfe-shell-container && npm run mfe-shared





mfe-shell-dev: mfe-shell-container/node_modules/.bin/ng
	cd mfe-shell-container && npm run start

mfe-shell-docker:
	docker build -t mfe-shell-container ./mfe-shell-container


mfe1-shared: mfe-shell-container/dist/mfe-shared/package.json
	cd $(BASE_DIR)/mfe-shell-container/dist/mfe-shared && npm link
	cd $(BASE_DIR)/mfe1-container && npm link mfe-shared


mfe1-container/node_modules/.bin/ng: mfe1-container/node_modules/mfe-shared/package.json
	@echo "Installing node modules in mfe1-container"
	cd $(BASE_DIR)/mfe1-container && npm install

mfe1-dev: mfe1-container/node_modules/.bin/ng
	cd mfe1-container && npm run start

mfe1-docker: mfe-shell-docker
	docker build --build-arg MFE_SHELL_IMAGE=mfe-shell-container -t mfe1-container ./mfe1-container
