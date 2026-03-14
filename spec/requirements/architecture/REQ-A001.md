# REQ-A001: Native Federation Architecture

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Standard-compliant module federation using Native Federation without Webpack dependency. Enables dynamic loading of multiple micro frontends (Angular and non-Angular) into a host shell application at runtime.

---

## Rationale

- Standards-compliant approach (not Webpack-specific)
- Supports both Angular and non-Angular remotes
- Enables configuration-driven MFE discovery
- Simplifies build and deployment process
- Aligns with industry best practices for federated architectures

---

## Key Implementation Points

- Uses `@angular-architects/native-federation` library
- Shell configuration at `mfe-shell-container/public/assets/contents/shell-config.json`
- Dynamic remote loading at runtime (remoteEntry.json per MFE)
- No code changes needed for new MFEs (configuration-driven)
- Supports both Angular and non-Angular frameworks (React, Vue, etc.)

---

## Current Status

✅ **Implemented**

The Native Federation architecture is fully operational:
- Shell bootstrap loads all remotes dynamically
- MFE1 (Angular) exposes routes via federation
- MFE2 (React) works via generic wrapper component
- Runtime configuration enables new MFEs without code changes

---

## Work Items

Implementation is complete, but documentation improvements are tracked:
- [DOC-001: Fix MFE1 Test Runner Documentation](../WORK.md#DOC-001) — ✅ Complete

---

## Related Requirements

- [REQ-A002: Shared Library Singleton Pattern](REQ-A002.md)
- [REQ-A003: Shell Dynamic Routing System](REQ-A003.md)
- [REQ-A004: Docker Deployment & Containerization](REQ-A004.md)
- [REQ-F001: MFE Shell](../features/REQ-F001.md)
- [REQ-F002: MFE1 Remote](../features/REQ-F002.md)
- [REQ-F003: MFE2 Remote](../features/REQ-F003.md)
- [REQ-F004: Native Federation Configuration](../features/REQ-F004.md)

---

## Architecture Context

This requirement forms the foundation of the entire system. The shell application (Angular 21) hosts and coordinates multiple micro frontends, each running as independent applications that expose functionality via Native Federation.

```
┌─────────────────────────────────────────┐
│     Shell (Angular 21)                  │
│     - Host for federation               │
│     - Routes coordination                │
│     - Singleton sharing (mfe-shared)    │
└──────────────┬──────────────────────────┘
       │
       ├─ MFE1 (Angular 21, localhost:3000)
       │    - Routes via federation
       │    - Shares mfe-shared library
       │
       └─ MFE2 (React 18, localhost:3002)
            - Component via federation
            - Local UserContext (by design)
```

---

**Last Updated:** 2026-03-14  
**Owner:** Architecture Team  
**Review Frequency:** As needed, or when remotes architecture changes
