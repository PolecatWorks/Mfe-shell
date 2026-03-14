# REQ-F001: MFE Shell (Angular 21)

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Host application built with Angular 21 that loads and manages remote micro frontends. Provides unified routing, navigation, and state management for all federated micro frontends.

---

## Rationale

- Serves as the entry point for end users
- Coordinates state across multiple frameworks (Angular, React)
- Provides consistent navigation and styling
- Implements federation bootstrap sequence
- Enables seamless multi-MFE experience

---

## Key Implementation Points

- Angular 21 with Native Federation host configuration
- Bootstraps federation at startup
- Dynamic route loading from shell-config.json
- Slide-in/slide-out route animations
- Material Design components
- Base routes: /home, /profile, /settings
- Singleton sharing of mfe-shared library

---

## Current Status

✅ **Implemented**

The Shell is fully operational and successfully loads both MFE1 and MFE2.

---

## Work Items

No immediate work items; Shell is stable.

---

## Related Requirements

- [REQ-001: Native Federation Architecture](../architecture/REQ-001.md)
- [REQ-002: Shared Library Singleton Pattern](../architecture/REQ-002.md)
- [REQ-003: Shell Dynamic Routing System](../architecture/REQ-003.md)
- [REQ-F002: MFE1 Remote](REQ-F002.md)
- [REQ-F003: MFE2 Remote](REQ-F003.md)

---

**Last Updated:** 2026-03-14  
**Owner:** Development Team  
**Review Frequency:** When adding new features or MFEs
