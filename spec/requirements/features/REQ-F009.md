# REQ-F009: Dynamic MFE Discovery

**Status:** PROPOSED  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Auto-discovery mechanism for MFEs to eliminate manual shell-config.json updates.

---

## Rationale

- Current approach: Manual updates to shell-config.json for each new MFE
- Slow iteration cycle for MFE onboarding
- Error-prone configuration management
- Future: Registry or auto-discovery mechanism simplifies scaling

---

## Key Implementation Points

- Registry server that MFEs register with at startup
- Or: DNS/service discovery (Consul, etc.)
- Or: Git-driven configuration (ArgoCD pattern)
- Backward compatible with current shell-config.json approach

---

## Current Status

⏳ **Pending**

This is a future enhancement. Current manual configuration works well for small number of MFEs.

---

## Work Items

- [FEAT-003: Implement MFE registry](../WORK.md#FEAT-003) — ⏳ Pending
  - Effort: 16-24 hours
  - Priority: Low

---

## Related Requirements

- [REQ-003: Shell Dynamic Routing System](../architecture/REQ-003.md)
- [REQ-F001: MFE Shell](REQ-F001.md)

---

## Considered Approaches

1. **Registry Service:** Centralized registry that MFEs register with
2. **Service Discovery:** Consul or similar for dynamic discovery
3. **Git-Driven:** ArgoCD pattern with Git as source of truth
4. **DNS SRV:** DNS-based service discovery for MFE endpoints

---

**Last Updated:** 2026-03-14  
**Owner:** Architecture Team  
**Review Frequency:** As MFE count grows
