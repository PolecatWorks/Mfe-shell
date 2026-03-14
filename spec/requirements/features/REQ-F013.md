# REQ-F013: MFE Shell (Angular 21)

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

- [REQ-A001: Native Federation Architecture](../architecture/REQ-A001.md)
- [REQ-A002: Shared Library Singleton Pattern](../architecture/REQ-A002.md)
- [REQ-A003: Shell Dynamic Routing System](../architecture/REQ-A003.md)
- [REQ-F010: MFE1 Remote](REQ-F010.md)
- [REQ-F011: MFE2 Remote](REQ-F011.md)

---

**Last Updated:** 2026-03-14  
**Owner:** Development Team  
**Review Frequency:** When adding new features or MFEs
