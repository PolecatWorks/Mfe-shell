# MFE Shell Container & MFE1

This project contains the Shell application and MFE1 for the Micro Frontend architecture. It is built with Angular and Angular Material.

## Prerequisites

- Node.js
- Docker (optional, for containerization)

## Getting Started

A `Makefile` is provided to simplify common tasks.

### Install Dependencies

```bash
make install
cd mfe1-container && npm install
```

### Run Development Server

**Important:** For local development, you must link the shared library to both the Shell and MFE1 to ensure they share the same singleton instance.

1. **Build `mfe-shared`:**
   ```bash
   cd mfe-shell-container && npm run build
   ```

2. **Link the Shared Library:**

   First, create the global link from the built library:
   ```bash
   cd mfe-shell-container/dist/mfe-shared && npm link
   ```

   Then, link it in the Shell:
   ```bash
   cd ../../..
   cd mfe-shell-container && npm link mfe-shared
   ```

   Finally, link it in MFE1:
   ```bash
   cd ../mfe1-container && npm link mfe-shared
   ```

3. **Start the Applications:**

   Start the Shell:
   ```bash
   make dev
   ```
   (Runs on `http://localhost:4200/`)

   Start MFE1:
   ```bash
   cd mfe1-container && npm start
   ```
   (Runs on `http://localhost:3000/`)

### Build Docker Images

**Shell:**

```bash
make docker-build
```

**MFE1:**

```bash
make docker-build-mfe1
```

## Project Structure

- `mfe-shell-container/`: The Angular application source code (Shell).
- `mfe1-container/`: The MFE1 application source code.
- `mfe-shell-container/Dockerfile`: Docker configuration for Shell.
- `mfe1-container/Dockerfile`: Docker configuration for MFE1.
