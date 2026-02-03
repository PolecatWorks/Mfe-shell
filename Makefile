.PHONY: dev docker-build install

install:
	cd mfe-shell-container && npm install

dev:
	cd mfe-shell-container && npm start

docker-build:
	docker build -t mfe-shell-container ./mfe-shell-container
