# Product Requirements Documents (PRDs) Registry

This directory contains the Product Requirements Documents (PRDs) defining the Micro-Frontend host portal, `@polecatworks/mfe-shared` singleton state/canvas contract, and ecosystem federation architecture of **MFE-Shell (`Mfe-shell`)**.

## Document Hierarchy & Structure

| Document | Description |
| :--- | :--- |
| [ci-cd-pipeline-improvements-prd.md](./ci-cd-pipeline-improvements-prd.md) | **CI/CD Pipeline Modernization & Automated Quality Gates PRD**: Defines the Build Once Promote Everywhere pattern (`check-image`), multi-arch content hash caching, container smoke testing, and Robot Framework integration test execution in CI, adopting best practices from `sward-warden`. |
| [keycloak-oidc-and-claims-distribution-prd.md](./keycloak-oidc-and-claims-distribution-prd.md) | **Canonical Ecosystem Keycloak OIDC, Claims Distribution & Service Auth Pattern PRD**: Single source of truth for the `shell-ui` PKCE OIDC client, `ecosystem-audiences` scope, `@polecatworks/mfe-shared` `SharedContextService` token distribution, zero-fake-auth policy, backend JWKS verification, RBAC, M2M `<service>-sa` pattern, and ecosystem client registry referenced by all service repos. |
| [shared-canvas-protocol-and-ecosystem-prd.md](./shared-canvas-protocol-and-ecosystem-prd.md) | **Shared Canvas Protocol (`@polecatworks/mfe-shared`) & Ecosystem Federation PRD**: Defines `SharedCanvasService` and the `MfeCanvasController` lifecycle contract (`applyPatch` RFC 6902 JSON Patch, `getState`, self-describing `getSchema`, silent `onStateChange`, `onSelectionChange` focus context, active-focus locks, and AI-attribution badges), upgrades `mfe1-container` wrappers, and federates `Angry-agent`, `data-engine`, and `agent-as-data` under `Mfe-shell`. |

## Related Specifications
- [MFE1 Container PRD (`mfe1-container/spec/PRD.md`)](../../mfe1-container/spec/PRD.md)
- [Architecture Overview (`spec/ARCHITECTURE.md`)](../ARCHITECTURE.md)
- [RFC Requirements Index (`spec/requirements/README.md`)](../requirements/README.md)
- [REQ-A005: Shared Canvas Protocol & Bidirectional MFE Controller](../requirements/architecture/REQ-A005.md)
- [REQ-A006: Build Once, Promote Everywhere & Container Verification](../requirements/architecture/REQ-A006.md)
