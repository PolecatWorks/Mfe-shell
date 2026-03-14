# REQ-D014: Root README.md

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Primary documentation for the entire MFE Shell project. Covers architecture, quick start, manual setup, test framework, and Docker configuration.

---

## Rationale

- Entry point for new developers
- Must accurately represent current system state
- Should enable quick onboarding
- Clear prerequisites prevent setup errors

---

## Key Implementation Points

- Quick Start section (with npm link prerequisite)
- Architecture overview with diagram
- Test framework documentation (accurate per container)
- Docker setup and port mapping
- Troubleshooting guide
- Cross-references to detailed docs

---

## Current Status

⚠️ **Implemented with improvements needed**

Root README exists but has issues:
- Missing npm link prerequisite in Quick Start
- Incomplete test framework documentation
- Unclear Docker port mapping diagram

---

## Work Items

This requirement is implemented through the following work items:

### ⏳ DOC-002: Add npm link Prerequisite to Quick Start — PENDING

**Priority:** 🟠 HIGH  
**Status:** ⏳ PENDING  
**Effort:** 0.5 hours (30 minutes)  

**Description:** Add npm link prerequisite documentation to README.md Quick Start section. Currently users following Quick Start get npm resolution errors if they skip the manual setup section.

**Problem:**
- Current: Quick Start suggests `npm start` without mentioning npm link requirement
- Users get npm resolution errors when attempting to start MFE1 integrated
- Manual setup section documents this, but isn't referenced from Quick Start

**Solution:** Add one of these approaches:
1. Prerequisite step: "Run `make mfe1-shared` before starting MFE1"
2. Integrate npm link into Quick Start flow with clear explanation
3. Add cross-reference from Quick Start to manual setup with npm link

**Files to Change:**
- README.md (root, lines ~96-97 area)

**Acceptance Criteria:**
- [ ] Quick Start clearly documents npm link requirement
- [ ] Users can follow all steps sequentially without npm errors
- [ ] Prerequisite is called out before attempting to run MFE1

**Related Issues:** Issue #3 and #6 from DOCUMENTATION_ANALYSIS.md (MEDIUM severity)

---

### ⏳ DOC-004: Update Test Framework Documentation — PENDING

**Priority:** 🟠 HIGH  
**Status:** ⏳ PENDING  
**Effort:** 0.5 hours (30 minutes)  

**Description:** Fix inconsistent test framework documentation in README.md. Currently says "Vitest" uniformly, but Shell uses Vitest while MFE1 uses Karma/Jasmine and MFE2 uses Jest.

**Problem:**
- Current: README.md says "Testing: Vitest" but this is incorrect for MFE1
- Confusion: Developers think all apps use same test runner
- Missing context: No explanation of why different frameworks per app

**Solution:** Create accurate testing documentation showing:
- Shell: Vitest (explicit in package.json)
- MFE1: Karma + Jasmine (Angular default, via ng test)
- MFE2: Jest (React default, via react-scripts test)

**Files to Change:**
- README.md (root, testing section)

**Acceptance Criteria:**
- [ ] Each container's test framework clearly identified
- [ ] Commands to run tests are accurate for each
- [ ] Explanation of why each framework is used

**Related Issues:** Issue #4 from DOCUMENTATION_ANALYSIS.md (MEDIUM severity)

---

### ⏳ DOC-005: Clarify Docker Port Mapping Diagram — PENDING

**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 0.5 hours (30 minutes)  

**Description:** Clarify Docker port mapping diagram in README.md. Current diagram is confusing about internal vs. external ports and what ports are used for what purpose.

**Problem:**
- Current diagram doesn't clearly show container internal ports (8080)
- Unclear which port is used for which application
- Confusion between development ports and Docker ports

**Solution:** Create or improve diagram showing:
- Internal ports (container view): 8080 for all
- External ports (host machine): 4200, 3000, 3002
- Purpose of each port
- How to access each app

**Files to Change:**
- README.md (root, Docker section)

**Acceptance Criteria:**
- [ ] Diagram clearly shows internal vs. external ports
- [ ] Purpose of each port is documented
- [ ] Developer knows which URL to visit for each app

**Related Issues:** Issue #2 from DOCUMENTATION_ANALYSIS.md (MEDIUM severity)

**Also Related To:** [REQ-A004: Docker Deployment & Containerization](../architecture/REQ-A004.md) — Shares Docker port mapping documentation needs

---

## Related Requirements

- [REQ-D015: Container READMEs](REQ-D015.md)
- [REQ-D016: Copilot Instructions](REQ-D016.md)

---

## Current Issues

See linked work items for specific issues and solutions.

---

**Last Updated:** 2026-03-14  
**Owner:** Documentation Team  
**Review Frequency:** After each major change to system
