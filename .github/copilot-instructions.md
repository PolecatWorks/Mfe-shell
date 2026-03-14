# Copilot Instructions for MFE Shell Repository

This repository implements a **Micro Frontend (MFE) architecture** using Angular 21, React 18, and Native Federation. It contains a Shell (Host) application that dynamically loads Remote Micro Frontends at runtime.

## Project Structure

- **`mfe-shell-container/`** - The host application (Angular) that loads remote MFEs. Contains a shared library (`projects/mfe-shared/`) used for singleton state management.
- **`mfe1-container/`** - Angular-based remote MFE that exposes routes via Native Federation.
- **`mfe2-container/`** - React-based remote MFE that exposes components via Esbuild.
- **`fluxcd-dev/`** - FluxCD manifests for deployment configuration.
- **`charts/`** - Helm charts (if applicable).

## Build, Test & Development Commands

### Installation
```bash
make install                    # Install dependencies for all apps
```

### Development (Local)
Each application runs on its own port and must be started separately:
```bash
make mfe-shell-dev              # Shell at http://localhost:4200
make mfe1-dev                   # MFE1 at http://localhost:3000 (Angular)
make mfe2-dev                   # MFE2 at http://localhost:3002 (React)
```

### Building
From the root of each container directory:
```bash
cd mfe-shell-container
npm run build                   # Build shell + mfe-shared library
npm run mfe-shared              # Build only the shared library

cd mfe1-container
npm run build                   # Build MFE1
npm start                       # Dev server

cd mfe2-container
npm run build                   # Build with Esbuild (static)
npm start                       # Dev server
```

### Testing
```bash
cd mfe-shell-container
npm test                        # Run Vitest for shell

cd mfe1-container
npm test                        # Run ng test (Karma-based)
```

### Docker
```bash
make mfe-shell-docker-run       # Build & run Shell in Docker (port 4200)
make mfe1-docker-run            # Build & run MFE1 in Docker (port 3000)
make mfe2-docker-run            # Build & run MFE2 in Docker (port 3002)
```

Override ports: `make mfe-shell-docker-run mfe-shell_PORT=5000`

## Architecture & Key Patterns

### 1. Native Federation
- The Shell and MFEs use **Native Federation** (part of the Angular ecosystem, standards-compliant, no Webpack).
- Each MFE exposes modules via `federation.config.js` or `build.js` (Esbuild).
- The Shell dynamically loads remotes at runtime using `loadRemoteModule()` and `loadComponent()`.

### 2. Shared Library (mfe-shared)
- Located in `mfe-shell-container/projects/mfe-shared/`.
- Built as a **singleton**: both Shell and MFE1 use the exact same instance in memory at runtime.
- Ensures shared state (e.g., `UserContext`, `SharedContextService`, `SharedHttpService`) is consistent.
- Uses `npm link` to symlink the built library to both Shell and MFE1's `node_modules`.

**Why npm link?** Because `mfe-shared` is a local library, `npm link` creates a symbolic link from the built distribution to the global npm store, ensuring both applications resolve the same physical files.

**MFE2 (React)**: Does not use the Angular-based shared library directly. Instead, duplicates the `UserContext` interface locally to avoid coupling to Angular.

### 3. Dynamic Route Loading
The Shell loads MFE routes based on **`shell-config.json`** (`mfe-shell-container/public/assets/contents/shell-config.json`):
- **Remotes**: Maps remote names to `remoteEntry.json` URLs.
- **MFE Routes**: Defines how the Shell loads each remote (path, exposed module, component name).
- **Menu**: Sidebar navigation entries.

**Heuristic for wrapping:**
- If `exposedModule` ends with `"routes"` or `componentName` is `"remoteRoutes"` → Angular routes (use `loadChildren`).
- Otherwise → Generic component (wrap with `GenericMfeWrapperComponent`, use `loadComponent`).

### 4. React in Angular Shell
MFE2 (React) is wrapped by the Shell's `GenericMfeWrapperComponent` which:
- Dynamically imports the exposed React component.
- Calls its `mount()` function to render into a DOM container.
- Calls `unmount()` on cleanup.
- This allows React and Angular to coexist in the same application.

### 5. Route Animations
The Shell provides **slide-in/slide-out animations** when routes change. MFEs don't need to implement animations; they simply render content at 100% width/height of their container.

## Adding a New Micro Frontend

1. **Create the MFE** (Angular or React) in a new `*-container/` directory.
2. **Expose modules** in `federation.config.js` (Angular) or `build.js` (Esbuild):
   ```javascript
   exposes: { './routes': './src/app/app.routes.ts' }  // Angular
   ```
3. **Update shell-config.json** with:
   - Remote entry in `remotes`
   - Route definition in `mfeRoutes`
   - Menu entry in `menu`
4. **If Angular + shared state**: Link `mfe-shared`:
   ```bash
   cd mfe-shell-container/dist/mfe-shared && npm link
   cd path/to/new-mfe && npm link mfe-shared
   ```
5. **Build & run** the MFE dev server; the Shell will load it automatically.

## Key Conventions

### File Organization
- **Shell**: `mfe-shell-container/src/app/` contains routing, config loading, and wrapper components.
- **MFE1 & MFE2**: Each has a `src/` directory with its own routing and components.
- **Shared Library**: `mfe-shell-container/projects/mfe-shared/src/lib/` contains services and interfaces.

### Naming
- MFE routes are lowercase (e.g., `mfe1`, `mfe2`).
- Angular services follow the pattern `*Service` (e.g., `SharedContextService`).
- Wrapper components use `Generic*` prefix (e.g., `GenericMfeWrapperComponent`).

### Configuration
- Shell configuration is **runtime-based** via `shell-config.json`, not compile-time hard-coded.
- This allows adding/removing MFEs without recompiling the Shell.

### Shared State
- Use `mfe-shared` services in Angular MFEs to access shared state.
- The singleton pattern ensures all consumers of `mfe-shared` reference the same in-memory instance.
- React MFEs should duplicate interfaces locally or implement a custom state bridge if needed.

### Testing
- **Shell**: Uses Vitest (`npm test` in mfe-shell-container).
- **MFE1**: Uses Angular's test runner (`npm test` in mfe1-container).
- Run tests before committing to `main` to ensure the MFE architecture doesn't break.

## CI/CD & Deployment

**Workflows** (see `.github/workflows/` and `.github/WORKFLOW_LOGIC.md`):
- **PR workflows** (`mfe-shell-ci-pr.yml`, `mfe1-ci-pr.yml`, `mfe2-ci-pr.yml`): Build and verify PRs.
  - MFE1 and MFE2 conditionally wait for Shell if Shell files changed (to use the correct base image).
- **Main workflows** (`mfe-shell-ci-main.yml`, `mfe1-ci-main.yml`, `mfe2-ci-main.yml`): Build and push to production registries.
- **Auto-deployment** (`update-fluxcd.yml`): Syncs Docker image tags to FluxCD manifests and creates auto-merging PRs.

**Image tags:**
- Development: `...-mfe-shell/dev:sha-<CONTENT_SHA>` (content-specific hash of `mfe-shell-container/` files).
- Production: `...-mfe-shell:main`, `...-mfe-shell:latest`, `...-mfe-shell:sha-<CONTENT_SHA>`.

## Troubleshooting

**Shell fails to load MFE:**
- Verify `shell-config.json` is correctly updated with the remote name and URL.
- Ensure the MFE dev server is running on the expected port.
- Check browser console for CORS or module loading errors.

**Shared library not syncing between Shell and MFE1:**
- Confirm `npm link` was executed for both the library and the consumer.
- Clear `node_modules` and re-run `make install` and `make mfe1-shared`.

**Tests failing after changes:**
- Run `npm test` in the affected container to identify failures.
- Check that no unrelated files were modified during development.

## Resources

- [Native Federation Docs](https://shorturl.at/jmzH0)
- `.github/WORKFLOW_LOGIC.md` - Detailed CI/CD pipeline logic
- `README.md` - High-level project overview
- `Makefile` - Quick reference for common commands
