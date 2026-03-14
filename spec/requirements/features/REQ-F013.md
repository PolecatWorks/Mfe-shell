# REQ-F013: Dynamic MFE Discovery

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

### ⏳ FEAT-003: Implement MFE Registry System — PENDING

**Priority:** 🟢 LOW  
**Status:** ⏳ PENDING  
**Effort:** 16-24 hours  

**Description:** Build auto-discovery or registry mechanism for MFEs to eliminate manual shell-config.json updates.

**Problem:**
- Currently: Manual updates to shell-config.json for each new MFE
- Slow iteration cycle for MFE onboarding
- Error-prone configuration management

**Solution:** Consider approaches:
1. Registry server that MFEs register with at startup
2. DNS/service discovery (Consul, etc.)
3. Git-driven configuration (ArgoCD pattern)
4. Hybrid approach combining multiple strategies

**Acceptance Criteria:**
- [ ] New MFEs can be added without modifying shell-config.json
- [ ] System is backward compatible with current manual config
- [ ] Configuration is auditable and versioned
- [ ] Discovery mechanism is reliable and performant
- [ ] Fallback to manual config if discovery fails

**Deliverables:**
- Registry service implementation (if registry approach chosen)
- MFE registration mechanism
- Shell discovery client
- Configuration migration tooling
- Comprehensive documentation
- Fallback procedures

---

## Related Requirements

- [REQ-A003: Shell Dynamic Routing System](../architecture/REQ-A003.md)
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
