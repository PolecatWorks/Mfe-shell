# REQ-F002: MFE1 Remote (Angular 21)

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

First micro frontend built with Angular 21. Exposes routes and shared library integration. Can run standalone at http://localhost:3000 or integrated into Shell.

---

## Rationale

- Demonstrates Angular micro frontend pattern
- Shows how to share state via mfe-shared library
- Provides reference implementation for future Angular MFEs
- Supports both standalone development and integrated testing

---

## Key Implementation Points

- Angular 21 with Native Federation remote configuration
- Exposes routes via federation
- Uses mfe-shared singleton library
- Test runner: Karma + Jasmine
- Standalone: `npm start` (requires `npm link` for mfe-shared)
- Integrated: Loaded by Shell via federation

---

## Current Status

✅ **Implemented with documentation improvements**

MFE1 is fully functional. Documentation has been improved (DOC-001 complete).

---

## Work Items

- [DOC-001: Fix MFE1 Test Runner Documentation](../WORK.md#DOC-001) — ✅ DONE
- [DOC-002: Add npm link prerequisite to Quick Start](../WORK.md#DOC-002) — ⏳ Pending

---

## Related Requirements

- [REQ-001: Native Federation Architecture](../architecture/REQ-001.md)
- [REQ-002: Shared Library Singleton Pattern](../architecture/REQ-002.md)
- [REQ-F001: MFE Shell](REQ-F001.md)
- [REQ-F006: MFE2 Shared Library Integration](REQ-F006.md) — Considers same pattern for React

---

## Running Modes

**Standalone Mode:**
```bash
cd mfe1-container
make mfe1-shared  # Link shared library
npm install
npm start
# Access at http://localhost:3000
```

**Integrated Mode:**
- Start Shell at http://localhost:4200
- MFE1 is loaded by Shell as a route
- Shares UserContext with Shell via mfe-shared

---

**Last Updated:** 2026-03-14  
**Owner:** Development Team  
**Review Frequency:** When adding features or updating Angular version
