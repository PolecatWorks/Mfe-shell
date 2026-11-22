# MFE-Shell TDD Build Specifications Index

This directory contains the ordered Test-Driven Development (TDD) build specifications derived from [spec/prds/README.md](../prds/README.md).

## Specification Lifecycle Rules
- **`draft`**: Spec is actively being authored or refined prior to implementation.
- **`complete`**: Marked once the spec features and tests are fully implemented and verified.
- **`deprecated`**: Marked when a historical spec is superseded by a newer spec.

---

## Ordered Build Specifications

| Order | Spec File | Status | Derived From PRD | Summary |
| :--- | :--- | :--- | :--- | :--- |
| **01** | [01-shared-canvas-service-spec.md](./01-shared-canvas-service-spec.md) | `complete` | [shared-canvas-protocol-and-ecosystem-prd.md](../prds/shared-canvas-protocol-and-ecosystem-prd.md) | `SharedCanvasService`, `MfeCanvasController`, RFC 6902 JSON Patch engine, and active-focus lock in `@polecatworks/mfe-shared`. |
| **02** | [02-mfe1-canvas-wrappers-and-shell-config-spec.md](./02-mfe1-canvas-wrappers-and-shell-config-spec.md) | `complete` | [shared-canvas-protocol-and-ecosystem-prd.md](../prds/shared-canvas-protocol-and-ecosystem-prd.md) | Upgrading `PersonalDataForm` & `mfe1` wrappers to `MfeCanvasController` (live `applyPatch`, `getState`, `getSchema`, `onStateChange`, `onSelectionChange`, AI attributions) and `shell-config.json` registration. |
| **03** | [03-keycloak-oidc-auth-and-claims-spec.md](./03-keycloak-oidc-auth-and-claims-spec.md) | `draft` | [keycloak-oidc-and-claims-distribution-prd.md](../prds/keycloak-oidc-and-claims-distribution-prd.md) | Public Keycloak client (`shell-ui`), PKCE OIDC login, ecosystem audiences scope, `DataAgentAdmins`/`DataAgentUsers` realm groups, and reactive token lifecycle in `SharedContextService`. |

