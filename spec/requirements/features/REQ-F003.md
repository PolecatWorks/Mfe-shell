# REQ-F003: MFE2 Remote (React 18)

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Second micro frontend built with React 18. Demonstrates non-Angular MFE support. Uses Esbuild for bundling and exposes mount/unmount lifecycle functions.

---

## Rationale

- Proves framework-agnostic MFE capability
- Shows how non-Angular frameworks integrate
- Esbuild provides simpler configuration than Webpack
- Demonstrates lifecycle hooks pattern
- Validates that Shell can manage multiple framework types

---

## Key Implementation Points

- React 18 with Esbuild (not Webpack)
- Exposes mount/unmount lifecycle functions
- Wrapped by GenericMfeWrapperComponent in Shell
- Duplicates UserContext locally (intentional, avoids Angular dependency)
- Standalone: `npm start` at http://localhost:3002
- Test runner: Jest (React default)

---

## Current Status

✅ **Implemented**

MFE2 is fully functional and demonstrates successful React integration.

---

## Work Items

No immediate work items; MFE2 is stable.

---

## Related Requirements

- [REQ-001: Native Federation Architecture](../architecture/REQ-001.md)
- [REQ-003: Shell Dynamic Routing System](../architecture/REQ-003.md)
- [REQ-F001: MFE Shell](REQ-F001.md)
- [REQ-F006: MFE2 Shared Library Integration](REQ-F006.md) — Future enhancement

---

## Design Decision: Local UserContext

MFE2 duplicates UserContext instead of using mfe-shared because:
- Avoids pulling Angular dependency into React application
- React state management patterns differ from Angular services
- Keeps MFE2 lightweight and independent
- Future: REQ-F006 considers bridge pattern for sharing

---

**Last Updated:** 2026-03-14  
**Owner:** Development Team  
**Review Frequency:** When adding features or updating React version
