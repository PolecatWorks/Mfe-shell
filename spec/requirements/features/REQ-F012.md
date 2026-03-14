# REQ-F012: Native Federation Configuration

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Detailed configuration of Native Federation in all MFEs. Defines remotes, shared libraries, and exposure points for each application.

---

## Rationale

- Standardizes federation configuration across all applications
- Ensures consistent behavior and compatibility
- Enables easy addition of new MFEs
- Clear specification of what each application exposes

---

## Key Implementation Points

- Shell: Host configuration with singleton sharing rules
- MFE1: Remote exposing routes and shared library imports
- MFE2: Remote exposing React component (no dependency on mfe-shared)
- Runtime discovery via remoteEntry.json per MFE
- Configuration-driven setup (no magic strings)

---

## Current Status

✅ **Implemented**

All federation configurations are properly set up and working.

---

## Work Items

No immediate work items; configuration is stable.

---

## Related Requirements

- [REQ-A001: Native Federation Architecture](../architecture/REQ-A001.md)
- [REQ-F013: MFE Shell](REQ-F013.md)
- [REQ-F010: MFE1 Remote](REQ-F010.md)
- [REQ-F011: MFE2 Remote](REQ-F011.md)

---

**Last Updated:** 2026-03-14  
**Owner:** Architecture Team  
**Review Frequency:** When adding new MFEs
