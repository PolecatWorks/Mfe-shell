# Architecture Specifications

This directory contains detailed specifications for the architectural components of the MFE Shell project.

## Files

- **FEDERATION_ARCHITECTURE.md** - Native Federation setup and configuration
- **SHARED_LIBRARY.md** - mfe-shared singleton pattern and linking
- **SHELL_ROUTING.md** - Shell's dynamic routing and MFE loading system
- **DOCKER_DEPLOYMENT.md** - Docker containerization and deployment

## Key Architecture Decisions

### 1. Native Federation (not Webpack)
Uses `@angular-architects/native-federation` for standards-compliant module federation without Webpack dependency. Allows mixed framework integration (Angular + React).

### 2. Singleton Shared Library
mfe-shared is linked via npm link to ensure Shell and MFE1 use exact same instance in memory for state consistency.

### 3. Configuration-Driven Integration
shell-config.json defines all remotes, routes, and menu items at runtime, allowing MFE additions without code changes.

### 4. Framework-Agnostic Wrapper
GenericMfeWrapperComponent handles any remote regardless of framework (React, Vue, Svelte, etc.).

## Related

- See [SPECIFICATIONS.md](../SPECIFICATIONS.md) for architecture spec index
- See [WORK_ITEMS.md](../WORK_ITEMS.md) for related work items (ARCH-001, DOC-006)
