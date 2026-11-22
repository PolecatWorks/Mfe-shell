# Specifications & Architecture Documentation

This directory is the canonical source of truth for **MFE-Shell (`Mfe-shell`)** architecture, Product Requirements Documents (PRDs), and Test-Driven Development (TDD) build specifications.

## Directory Structure

```text
spec/
├── README.md                                       # This file — navigation and documentation index
├── ARCHITECTURE.md                                 # System architecture overview with Mermaid diagrams
├── prds/                                           # Product Requirements Documents (source of truth for product design)
│   ├── README.md                                   # PRD registry and hierarchy
│   ├── ci-cd-pipeline-improvements-prd.md          # CI/CD pipeline modernization & quality gates
│   ├── keycloak-oidc-and-claims-distribution-prd.md # Keycloak OIDC authentication & claims distribution
│   └── shared-canvas-protocol-and-ecosystem-prd.md # Shared Canvas Protocol & ecosystem federation
└── specs/                                          # Ordered TDD build specifications derived from PRDs
    ├── README.md                                   # Build specification index and lifecycle rules
    ├── 01-shared-canvas-service-spec.md            # SharedCanvasService & MfeCanvasController (complete)
    └── 02-mfe1-canvas-wrappers-and-shell-config-spec.md # MFE1 canvas wrappers & shell-config (complete)
```

## Workflow

1. **Product Requirements (`prds/`)**: Define product capabilities, architectural contracts, and ecosystem integration goals in [spec/prds/README.md](./prds/README.md).
2. **TDD Build Specifications (`specs/`)**: Derive ordered implementation specifications with clear contracts and test strategies in [spec/specs/README.md](./specs/README.md).
   - Spec statuses follow the lifecycle: `draft` → `complete` → `deprecated`.
   - Completed specs are preserved as immutable historical records.
3. **Architecture Overview**: Reference [spec/ARCHITECTURE.md](./ARCHITECTURE.md) for high-level system diagrams, Native Federation topology, Kubernetes `VirtualService` routing, and shared library patterns.

## Quick Navigation

| Area | Document | Description |
| :--- | :--- | :--- |
| **PRDs** | [prds/README.md](./prds/README.md) | Registry of all active Product Requirements Documents. |
| **TDD Specs** | [specs/README.md](./specs/README.md) | Ordered TDD build specifications and implementation status. |
| **Architecture** | [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level system architecture, federation flow, and Kubernetes composition. |
| **MFE1 PRD** | [../mfe1-container/spec/PRD.md](../mfe1-container/spec/PRD.md) | Container-specific PRD for `mfe1-container`. |
