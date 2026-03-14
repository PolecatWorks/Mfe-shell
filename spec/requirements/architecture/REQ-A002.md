# REQ-A002: Shared Library (mfe-shared) Singleton Pattern

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Singleton shared library ensuring state consistency and behavior parity across Shell and Angular micro frontends. Located in `mfe-shell-container/projects/mfe-shared/`.

---

## Rationale

- Prevents duplicate state management code
- Ensures consistent UserContext across Shell and MFE1
- Simplifies dependency management
- Enables shared services (HTTP, logging, etc.)
- Single source of truth for cross-MFE communication

---

## Key Implementation Points

- Linked via `npm link` for singleton behavior
- Contains: SharedContextService, SharedHttpService, UserContext
- Angular-based (MFE2 React duplicates interfaces locally as design choice)
- Prerequisite: Must run `make mfe1-shared` before starting integrated Shell
- Symmetrical dependency sharing via Native Federation

---

## Current Status

✅ **Implemented with documentation needs**

The shared library is working, but prerequisite documentation needs improvement:
- [DOC-002: Add npm link prerequisite to Quick Start](../WORK.md#DOC-002) — ⏳ Pending

---

## Work Items

- [DOC-002: Add npm link prerequisite to Quick Start](../WORK.md#DOC-002) — ⏳ Pending
- [FEAT-002: Evaluate shared library integration for MFE2](../WORK.md#FEAT-002) — ⏳ Pending (proposed)

---

## Related Requirements

- [REQ-A001: Native Federation Architecture](REQ-A001.md)
- [REQ-F002: MFE1 Remote](../features/REQ-F002.md)
- [REQ-F006: MFE2 Shared Library Integration](../features/REQ-F006.md) — Future enhancement

---

## Design Decisions

**Why npm link instead of registry publish?**
- Development velocity: Changes to shared library immediately available
- No need for build/publish cycles during development
- Simpler for small team with co-located projects

**Why Angular-based?**
- Shell and MFE1 both use Angular
- Reduces dependency complexity
- Works seamlessly with Angular's DI system

**Why does MFE2 duplicate UserContext?**
- MFE2 is React (different framework)
- Avoids pulling Angular dependency into React app
- Intentional design choice to keep MFE2 lightweight

---

**Last Updated:** 2026-03-14  
**Owner:** Architecture Team  
**Review Frequency:** When shared library changes or new MFEs added
