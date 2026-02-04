.PHONY: dev docker-build install

install:
	cd mfe-shell-container && npm install

dev:
	cd mfe-shell-container && npm start

docker-build:
	docker build -t mfe-shell-container ./mfe-shell-container

docker-build-mfe1:
	docker build -f mfe1-container/Dockerfile -t mfe1-container .
