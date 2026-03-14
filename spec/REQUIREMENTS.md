# Requirements

This document captures system requirements and specifications using an RFC-inspired approach. Each requirement has a status (Active, Proposed, Superseded) and version history. When requirements change, the old version is preserved with supersession information for auditability.

**Last Updated:** 2026-03-14  
**Total Active Requirements:** 12  
**Total Superseded:** 0  
**Format:** RFC-inspired with version control

---

## Architecture Requirements

### REQ-001: Native Federation Architecture
**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Standard-compliant module federation using Native Federation without Webpack dependency. Enables dynamic loading of multiple micro frontends (Angular and non-Angular) into a host shell application at runtime.

**Rationale:**
- Standards-compliant approach (not Webpack-specific)
- Supports both Angular and non-Angular remotes
- Enables configuration-driven MFE discovery
- Simplifies build and deployment process

**Key Implementation Points:**
- Uses @angular-architects/native-federation
- Shell configuration at `mfe-shell-container/public/assets/contents/shell-config.json`
- Dynamic remote loading at runtime (remoteEntry.json per MFE)
- No code changes needed for new MFEs

**Status:** ✅ Implemented  
**Implementation:** See WORK.md#DOC-001 (completed)

---

### REQ-002: Shared Library (mfe-shared) Singleton Pattern
**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Singleton shared library ensuring state consistency and behavior parity across Shell and Angular micro frontends. Located in `mfe-shell-container/projects/mfe-shared/`.

**Rationale:**
- Prevents duplicate state management code
- Ensures consistent UserContext across Shell and MFE1
- Simplifies dependency management
- Enables shared services (HTTP, logging, etc.)

**Key Implementation Points:**
- Linked via `npm link` for singleton behavior
- Contains: SharedContextService, SharedHttpService, UserContext
- Angular-based (MFE2 React duplicates interfaces locally as design choice)
- Prerequisite: Must run `make mfe1-shared` before starting integrated Shell

**Status:** ✅ Implemented  
**Implementation:** Working, needs prerequisite documentation (see WORK.md#DOC-002)

---

### REQ-003: Shell Dynamic Routing System
**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Runtime-configured MFE loading based on shell-config.json. All remotes, routes, and menu items defined at runtime without code changes.

**Rationale:**
- Configuration-driven architecture eliminates need for code deployment on route changes
- Single configuration source for all routing decisions
- Heuristic-based wrapper strategy (Angular routes vs. generic component)
- Faster iteration cycle for MFE discovery

**Key Implementation Points:**
- Configuration file: `mfe-shell-container/public/assets/contents/shell-config.json`
- GenericMfeWrapperComponent for non-Angular frameworks
- Shell-config.json defines: remotes, routes, menu items, metadata
- Runtime heuristic determines wrapping strategy

**Status:** ✅ Implemented  
**Implementation:** No pending work

---

### REQ-004: Docker Deployment & Containerization
**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Multi-container Docker setup with consistent port mapping and orchestration. Each MFE can run standalone or integrated within the Shell.

**Rationale:**
- Consistent development and production environments
- Easy scaling and dependency management
- Support for both local development and production deployment
- Clear port mapping for debugging and verification

**Key Implementation Points:**
- Container internal port: 8080 (all apps)
- External ports: 4200 (Shell), 3000 (MFE1), 3002 (MFE2)
- Dockerfile per container with dev/prod configurations
- Each container can run independently or as part of stack

**Status:** ✅ Implemented  
**Implementation:** No pending work (docker-compose considered for future, see WORK.md#DOCKER-001)

---

## Feature Requirements

### REQ-F001: MFE Shell (Angular 21)
**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Host application built with Angular 21 that loads and manages remote micro frontends. Provides unified routing, navigation, and state management.

**Key Implementation Points:**
- Angular 21 with Native Federation host configuration
- Bootstraps federation at startup
- Dynamic route loading from shell-config.json
- Slide-in/slide-out route animations
- Material Design components
- Base routes: /home, /profile, /settings

**Status:** ✅ Implemented  
**Implementation:** No pending work

---

### REQ-F002: MFE1 Remote (Angular 21)
**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
First micro frontend built with Angular 21. Exposes routes and shared library integration. Can run standalone at http://localhost:3000 or integrated into Shell.

**Key Implementation Points:**
- Angular 21 with Native Federation remote configuration
- Exposes routes via federation
- Uses mfe-shared singleton library
- Test runner: Karma + Jasmine
- Standalone: `npm start` (requires `npm link` for mfe-shared)

**Status:** ✅ Implemented (with documentation improvements needed)  
**Implementation:** See WORK.md#DOC-001 (completed)

---

### REQ-F003: MFE2 Remote (React 18)
**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Second micro frontend built with React 18. Demonstrates non-Angular MFE support. Uses Esbuild for bundling and exposes mount/unmount lifecycle functions.

**Key Implementation Points:**
- React 18 with Esbuild (not Webpack)
- Exposes mount/unmount lifecycle functions
- Wrapped by GenericMfeWrapperComponent in Shell
- Duplicates UserContext locally (intentional, avoids Angular dependency)
- Standalone: `npm start` at http://localhost:3002

**Status:** ✅ Implemented  
**Implementation:** No pending work

---

### REQ-F004: Native Federation Configuration
**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Detailed configuration of Native Federation in all MFEs. Defines remotes, shared libraries, and exposure points.

**Key Implementation Points:**
- Shell: Host configuration with singleton sharing rules
- MFE1: Remote exposing routes and shared library imports
- MFE2: Remote exposing React component (no dependency on mfe-shared)
- Runtime discovery via remoteEntry.json per MFE

**Status:** ✅ Implemented  
**Implementation:** No pending work

---

### REQ-F005: CI/CD Workflows
**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
GitHub Actions workflows for automated build, test, and deployment. Includes PR workflows with conditional dependencies and main branch production workflows.

**Key Implementation Points:**
- PR workflows: Shell → MFE1 → MFE2 (conditional waits)
- Main workflows: Production builds with tagged images
- Auto-deployment: FluxCD manifests updated via auto-merging PRs
- Image tagging: sha-<CONTENT_SHA> for content-specific tracking

**Status:** ✅ Implemented  
**Implementation:** No pending work

---

### REQ-F006: MFE2 Shared Library Integration
**Status:** PROPOSED  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Future integration of mfe-shared library with MFE2 (React) to share state and services across frameworks.

**Rationale:**
- Current approach: MFE2 duplicates UserContext locally
- Improvement: Use shared library for consistent state
- Challenge: mfe-shared is Angular-based, MFE2 is React

**Estimated Effort:** 8-16 hours  
**Priority:** Medium  

**Status:** 🔄 Pending  
**Implementation:** See WORK.md#FEAT-002

---

### REQ-F007: E2E Testing Framework
**Status:** PROPOSED  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
End-to-end testing framework for Shell + MFEs integration scenarios.

**Rationale:**
- Current approach: Unit tests only (Vitest, Karma, Jest)
- Gap: No integration tests for federation behavior
- Suggestion: Playwright for cross-framework testing

**Estimated Effort:** 12-20 hours  
**Priority:** Medium  

**Status:** 🔄 Pending  
**Implementation:** See WORK.md#TEST-001

---

### REQ-F008: Docker Compose Orchestration
**Status:** PROPOSED  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Docker Compose configuration for full-stack development and testing.

**Rationale:**
- Current approach: Manual startup of each container
- Improvement: Single `docker-compose up` command
- Benefit: Faster development, consistent environments, easier CI/CD

**Estimated Effort:** 4-6 hours  
**Priority:** Low  

**Status:** 🔄 Pending  
**Implementation:** See WORK.md#DOCKER-001

---

### REQ-F009: Dynamic MFE Discovery
**Status:** PROPOSED  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Auto-discovery mechanism for MFEs without manual shell-config.json updates.

**Rationale:**
- Current approach: Manual updates to shell-config.json for each new MFE
- Improvement: Registry or auto-discovery mechanism
- Benefit: Simpler MFE onboarding, faster iteration

**Estimated Effort:** 16-24 hours  
**Priority:** Low  

**Status:** 🔄 Pending  
**Implementation:** See WORK.md#FEAT-003

---

## Documentation Requirements

### REQ-D001: Root README.md
**Status:** ACTIVE  
**Version:** 1.0 (with improvements planned)  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Primary documentation for the entire MFE Shell project. Covers architecture, quick start, manual setup, test framework, and Docker configuration.

**Current Issues (from analysis):**
- Missing npm link prerequisite in Quick Start
- Incomplete test framework documentation (says "Vitest" uniformly)
- Unclear Docker port mapping diagram

**Status:** ⚠️ Implemented with improvements needed  
**Implementation:** See WORK.md#DOC-002, WORK.md#DOC-004, WORK.md#DOC-005

---

### REQ-D002: Container READMEs (Shell & MFE1)
**Status:** ACTIVE  
**Version:** 1.0 (MFE1 improved, Shell pending)  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Documentation for individual container applications. Should provide MFE-specific guidance, not generic Angular CLI boilerplate.

**Current Status:**
- ✅ MFE1 README: Updated with MFE context, accurate test runner info (DOC-001 completed)
- ⚠️ Shell README: Still generic boilerplate, needs MFE context and federation guidance

**Status:** ✅ MFE1 Complete, ⚠️ Shell Pending  
**Implementation:** See WORK.md#DOC-003, WORK.md#DOC-008

---

### REQ-D003: Copilot Instructions
**Status:** ACTIVE  
**Version:** 1.0 (needs updates after README fixes)  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
AI assistant instructions for efficient repository navigation and task execution. Located at `.github/copilot-instructions.md`.

**Status:** ✅ Implemented  
**Implementation:** Needs updates after other doc fixes, see WORK.md#DOC-009

---

### REQ-D004: Architecture Documentation Specification
**Status:** PROPOSED  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

**Description:**
Formalized specification document covering all architecture components, design decisions, constraints, and trade-offs.

**Purpose:**
- Central reference for architecture decisions
- Why each component exists and how it fits
- Integration patterns and data flow
- Constraints and trade-off decisions

**Status:** 🔄 Pending  
**Implementation:** See WORK.md#DOC-006

---

## Summary

| Category | Active | Proposed | Superseded |
|----------|--------|----------|-----------|
| Architecture | 4 | 0 | 0 |
| Features | 5 | 4 | 0 |
| Documentation | 3 | 1 | 0 |
| **TOTAL** | **12** | **5** | **0** |

---

## How Supersession Works

When a requirement needs to change, create a new version and mark the old one as superseded:

**Example (future change):**
```markdown
### REQ-001: Native Federation Architecture
**Status:** ACTIVE
**Version:** 2.0 (UPDATED 2026-04-15)
**Supersedes:** REQ-001 v1.0
**Superseded by:** None

Changes in v2.0:
- Added support for [new capability]
- Changed [approach] from [old] to [new]

---

## Superseded

### REQ-001-v1: Native Federation Architecture (SUPERSEDED)
**Status:** SUPERSEDED by REQ-001 v2.0
**Proposed:** 2026-03-14
**Superseded:** 2026-04-15
**Reason:** [Why it changed]

Old approach: [description]
Why it changed: [rationale]
See: REQ-001 v2.0 for current approach
```

---

**Maintainer:** Development Team  
**Last Review:** 2026-03-14  
**Next Review:** After completing immediate work items
