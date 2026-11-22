# Product Requirements Documents (PRDs) Registry

This directory contains the Product Requirements Documents (PRDs) defining the Micro-Frontend host portal, `@polecatworks/mfe-shared` singleton state/canvas contract, authentication authority, and ecosystem federation architecture of **MFE-Shell (`Mfe-shell`)**.

## Document Hierarchy & Structure

| Document | Description |
| :--- | :--- |
| [ci-cd-pipeline-improvements-prd.md](./ci-cd-pipeline-improvements-prd.md) | **CI/CD Pipeline Modernization & Automated Quality Gates PRD**: Defines the Build Once Promote Everywhere pattern (`check-image`), multi-arch content hash caching, container smoke testing, and Robot Framework integration test execution in CI, adopting best practices from `sward-warden`. |
| [keycloak-oidc-and-claims-distribution-prd.md](./keycloak-oidc-and-claims-distribution-prd.md) | **Keycloak OIDC Authentication & Client Claims Distribution PRD**: Defines how `mfe-shell-container` and `@polecatworks/mfe-shared` act as the single OIDC authentication authority (Authorization Code + PKCE, audience/client scope negotiation, silent refresh, and reactive token broadcast via `SharedContextService`). |
| [shared-canvas-protocol-and-ecosystem-prd.md](./shared-canvas-protocol-and-ecosystem-prd.md) | **Shared Canvas Protocol (`@polecatworks/mfe-shared`) & Ecosystem Federation PRD**: Defines `SharedCanvasService` and the `MfeCanvasController` lifecycle contract (`applyPatch` RFC 6902 JSON Patch, `getState`, self-describing `getSchema`, silent `onStateChange`, `onSelectionChange` focus context, active-focus locks, and AI-attribution badges), upgrades `mfe1-container` wrappers, and federates `Angry-agent`, `data-engine`, and `agent-as-data` under `Mfe-shell`. |

## Related Specifications
- [TDD Build Specifications Index (`spec/specs/README.md`)](../specs/README.md)
- [Architecture Overview (`spec/ARCHITECTURE.md`)](../ARCHITECTURE.md)
- [MFE1 Container PRD (`mfe1-container/spec/PRD.md`)](../../mfe1-container/spec/PRD.md)
