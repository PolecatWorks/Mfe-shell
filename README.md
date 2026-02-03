# MFE Shell Container

This is the Shell application for the Micro Frontend architecture. It is built with Angular and Angular Material.

## Prerequisites

- Node.js
- Docker (optional, for containerization)

## Getting Started

A `Makefile` is provided to simplify common tasks.

### Install Dependencies

```bash
make install
```

### Run Development Server

```bash
make dev
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build Docker Image

```bash
make docker-build
```

This will build a Docker image named `mfe-shell-container` using Nginx to serve the production build.

## Project Structure

- `mfe-shell-container/`: The Angular application source code.
- `mfe-shell-container/Dockerfile`: Docker configuration.
- `mfe-shell-container/nginx.conf`: Nginx configuration for serving the app.
