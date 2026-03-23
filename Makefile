.PHONY: dev docker-build install

BASE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

mfe-shell_PORT := 4200
mfe1_PORT := 3000
mfe2_PORT := 3002

mfe-shell_DOCKER_BUILD_OPTS := --secret id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN
mfe1_DOCKER_BUILD_OPTS := --secret id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN
mfe2_DOCKER_BUILD_OPTS := --secret id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN

clean:
	rm -rf mfe-shell-container/node_modules
	rm -rf mfe-shell-container/dist
	rm -rf mfe1-container/node_modules
	rm -rf mfe1-container/dist



install:
	cd mfe-shell-container && npm install
	cd mfe1-container && npm install
	cd mfe2-container && npm install

mfe-shell-container/node_modules/.bin/ng:
	@echo "Installing node modules in mfe-shell-container"
	cd $(BASE_DIR)/mfe-shell-container && npm install

mfe-shared-dev:
	@echo "Building and linking @polecatworks/mfe-shared for local development"
	cd mfe-shell-container && npm run mfe-shared
	cd mfe-shell-container/dist/mfe-shared && npm link

mfe-shell-dev: mfe-shell-container/node_modules/.bin/ng
	cd mfe-shell-container && npm run start

mfe-shell-docker:
	cd mfe-shell-container && docker build ${mfe-shell_DOCKER_BUILD_OPTS} -t mfe-shell-container .

mfe-shell-docker-run: mfe-shell-docker
	docker run -it --rm -p $(mfe-shell_PORT):8080 mfe-shell-container


mfe1-container/node_modules/.bin/ng: mfe1-container/package.json
	@echo "Installing node modules in mfe1-container"
	cd $(BASE_DIR)/mfe1-container && npm install

mfe1-dev: mfe1-container/node_modules/.bin/ng
	cd mfe1-container && ng serve --port ${mfe1_PORT}

mfe1-docker:
	cd mfe1-container && docker build ${mfe1_DOCKER_BUILD_OPTS} -t mfe1-container .

mfe1-docker-run: mfe1-docker
	docker run -it --rm -p $(mfe1_PORT):8080 mfe1-container


mfe2-install:
	@echo "Installing node modules in mfe2-container"
	cd $(BASE_DIR)/mfe2-container && npm install

mfe2-dev: mfe2-install
	cd mfe2-container && npm start

mfe2-docker:
	cd mfe2-container && docker build ${mfe2_DOCKER_BUILD_OPTS} -t mfe2-container .

mfe2-docker-run: mfe2-docker
	docker run -it --rm -p $(mfe2_PORT):8080 mfe2-container
