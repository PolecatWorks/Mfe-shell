# Work Items

This document tracks all active work to implement and improve the MFE Shell system. Each work item is linked to one or more requirements from REQUIREMENTS.md. Work items include: implementation tasks, documentation improvements, feature development, and testing enhancements.

**Last Updated:** 2026-03-14  
**Total Items:** 15  
**Status:** 1 ✅ Done, 0 🔄 In Progress, 14 ⏳ Pending

---

## Quick Status

| Priority | Pending | In Progress | Done |
|----------|---------|-------------|------|
| 🔴 Critical | 0 | 0 | 1 |
| 🟠 High | 4 | 0 | 0 |
| 🟡 Medium | 8 | 0 | 0 |
| 🟢 Low | 2 | 0 | 0 |

---

## Documentation Work

### DOC-001: Fix MFE1 Test Runner Documentation
**Requirement:** REQ-F002 (MFE1 Remote), REQ-D002 (Container READMEs)  
**Priority:** 🔴 CRITICAL  
**Status:** ✅ DONE  
**Effort:** 0.25 hours (15 minutes)  
**Completion Date:** 2026-03-14  

**Description:**
Updated mfe1-container/README.md to provide clear MFE context and accurate test runner documentation. Addressed confusion between different test frameworks across the system (Shell uses Vitest, MFE1 uses Karma).

**Problem Addressed:**
- Original README was generic Angular CLI boilerplate with no MFE context
- Developers didn't understand the relationship between MFE1 and the Shell
- Missing prerequisite: need to run `make mfe1-shared` before local development

**Solution Implemented:**
- ✅ Added MFE context header explaining role in architecture
- ✅ Added "About This MFE" section with standalone vs. integrated modes
- ✅ Updated Angular CLI version (19.2.19 → 21.2.1)
- ✅ Clarified test runner: Karma + Jasmine (accurate)
- ✅ Added note about Shell using different test runner (Vitest)
- ✅ Added shared library linking prerequisite
- ✅ Added cross-references to main README

**Files Changed:**
- mfe1-container/README.md

**Acceptance Criteria:**
- [x] Test runner clearly identified (Karma + Jasmine)
- [x] Documentation matches actual implementation
- [x] MFE context provided in first section
- [x] Shared library prerequisite documented
- [x] Cross-reference to main README for architecture
- [x] Version information accurate

**Related Issues:**
- Issue #1 from DOCUMENTATION_ANALYSIS.md (HIGH severity)
- Issue #9 from DOCUMENTATION_ANALYSIS.md (LOW severity)

**UAT Reference:** See tasks/DOC-001.md for acceptance testing guide

---

### DOC-002: Add npm link Prerequisite to Quick Start
**Requirement:** REQ-D001 (Root README)  
**Priority:** 🟠 HIGH  
**Status:** ⏳ PENDING  
**Effort:** 0.5 hours (30 minutes)  

**Description:**
Add npm link prerequisite documentation to README.md Quick Start section. Currently users following Quick Start get npm resolution errors if they skip the manual setup section.

**Problem:**
- Current: Quick Start suggests `npm start` without mentioning npm link requirement
- Users get npm resolution errors when attempting to start MFE1 integrated
- Manual setup section documents this, but isn't referenced from Quick Start

**Solution:**
Add one of these approaches:
1. Prerequisite step: "Run `make mfe1-shared` before starting MFE1"
2. Integrate npm link into Quick Start flow with clear explanation
3. Add cross-reference from Quick Start to manual setup with npm link

**Files to Change:**
- README.md (root, lines ~96-97 area)

**Acceptance Criteria:**
- [ ] Quick Start clearly documents npm link requirement
- [ ] Users can follow all steps sequentially without npm errors
- [ ] Prerequisite is called out before attempting to run MFE1

**Related Issues:**
- Issue #3 from DOCUMENTATION_ANALYSIS.md (MEDIUM severity)
- Issue #6 from DOCUMENTATION_ANALYSIS.md (MEDIUM severity)

---

### DOC-003: Replace shell-container README with MFE Context Documentation
**Requirement:** REQ-D002 (Container READMEs)  
**Priority:** 🟠 HIGH  
**Status:** ⏳ PENDING  
**Effort:** 1 hour (60 minutes)  

**Description:**
Replace generic Angular CLI boilerplate in shell-container/README.md with MFE-specific documentation covering Shell's role as federation host, how to boot the system, and important development considerations.

**Problem:**
- Current README is generic Angular CLI boilerplate
- No explanation of Shell's special role as federation host
- Missing information about booting MFEs, debug ports, federation bootstrap

**Solution:**
Restructure to include:
- Shell's role in the architecture (host, not standalone)
- How to start Shell with integrated MFEs
- How to start Shell standalone (for testing)
- MFE bootstrap and loading sequence
- Development workflow notes
- Debugging federation issues

**Files to Change:**
- shell-container/README.md (complete restructure)

**Acceptance Criteria:**
- [ ] Shell's role as federation host is clear
- [ ] Documentation is MFE-specific (not generic Angular)
- [ ] Developer knows how to boot integrated system
- [ ] Troubleshooting section covers federation issues

**Related Issues:**
- Issue #5 from DOCUMENTATION_ANALYSIS.md (MEDIUM severity)

---

### DOC-004: Update Test Framework Documentation
**Requirement:** REQ-D001 (Root README)  
**Priority:** 🟠 HIGH  
**Status:** ⏳ PENDING  
**Effort:** 0.5 hours (30 minutes)  

**Description:**
Fix inconsistent test framework documentation in README.md. Currently says "Vitest" uniformly, but Shell uses Vitest while MFE1 uses Karma/Jasmine and MFE2 uses Jest.

**Problem:**
- Current: README.md says "Testing: Vitest" but this is incorrect for MFE1
- Confusion: Developers think all apps use same test runner
- Missing context: No explanation of why different frameworks per app

**Solution:**
Create accurate testing documentation showing:
- Shell: Vitest (explicit in package.json)
- MFE1: Karma + Jasmine (Angular default, via ng test)
- MFE2: Jest (React default, via react-scripts test)

**Files to Change:**
- README.md (root, testing section)

**Acceptance Criteria:**
- [ ] Each container's test framework clearly identified
- [ ] Commands to run tests are accurate for each
- [ ] Explanation of why each framework is used

**Related Issues:**
- Issue #4 from DOCUMENTATION_ANALYSIS.md (MEDIUM severity)

---

### DOC-005: Clarify Docker Port Mapping Diagram
**Requirement:** REQ-D001 (Root README), REQ-004 (Docker Deployment)  
**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 0.5 hours (30 minutes)  

**Description:**
Clarify Docker port mapping diagram in README.md. Current diagram is confusing about internal vs. external ports and what ports are used for what purpose.

**Problem:**
- Current diagram doesn't clearly show container internal ports (8080)
- Unclear which port is used for which application
- Confusion between development ports and Docker ports

**Solution:**
Create or improve diagram showing:
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

**Related Issues:**
- Issue #2 from DOCUMENTATION_ANALYSIS.md (MEDIUM severity)

---

### DOC-006: Create Formal Architecture Specification Document
**Requirement:** REQ-D004 (Architecture Documentation Spec)  
**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 4 hours (240 minutes)  

**Description:**
Create comprehensive architecture specification document covering all components, design decisions, constraints, and trade-offs. This serves as the canonical reference for architectural questions.

**Solution:**
Create document covering:
- Component overview (Shell, MFE1, MFE2, mfe-shared)
- Architecture patterns (federation, singleton, state management)
- Data flow and communication patterns
- Design decisions and trade-offs
- Constraints and limitations
- Integration points
- Debugging and troubleshooting guide

**Files to Create:**
- spec/ARCHITECTURE_SPECIFICATION.md (new)

**Acceptance Criteria:**
- [ ] All 4 architecture components documented
- [ ] Design decisions explained with rationale
- [ ] Data flow clear and documented
- [ ] Integration points explained

**Related Issues:**
- General documentation improvement

---

### DOC-007: Clarify Docker MFE1 Dependency Intent
**Requirement:** REQ-004 (Docker Deployment)  
**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 0.5 hours (30 minutes)  

**Description:**
Clarify in Docker documentation whether mfe1-container should be a standalone app or always linked as part of Shell composition. Current setup is ambiguous about the intent.

**Problem:**
- Dockerfile for mfe1-container exists but dependency in docker-compose isn't clear
- Unclear if mfe1 should run independently or only as part of Shell
- Documentation doesn't explain the relationship

**Solution:**
Document the intended Docker setup:
- Is mfe1 standalone for testing purposes?
- Or is it only meant to run as part of compose stack?
- What's the actual use case?

**Files to Change:**
- Docker-related docs and Dockerfiles

**Acceptance Criteria:**
- [ ] Intent of mfe1-container Docker setup is clear
- [ ] Documentation matches actual deployment use case

**Related Issues:**
- Issue #7 from DOCUMENTATION_ANALYSIS.md (MEDIUM severity)

---

### DOC-008: Update Angular CLI Version References
**Requirement:** REQ-D002 (Container READMEs)  
**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 0.25 hours (15 minutes)  

**Description:**
Update all references to Angular CLI version across documentation. Ensure version numbers match actual implementation (Angular 21, not 19.2.19).

**Problem:**
- Some docs reference old Angular versions
- package.json shows Angular 21 but some README docs mention 19.2.19

**Solution:**
Search all docs and update to consistent version 21.2.1

**Files to Change:**
- Any README mentioning Angular CLI version

**Acceptance Criteria:**
- [ ] All Angular version references updated to 21.2.1
- [ ] Version matches package.json

**Related Issues:**
- Issue #8 from DOCUMENTATION_ANALYSIS.md (LOW severity)

---

### DOC-009: Update Copilot Instructions After README Fixes
**Requirement:** REQ-D003 (Copilot Instructions)  
**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING (blocked: waiting on other DOC items)  
**Effort:** 0.5 hours (30 minutes)  
**Blocked by:** DOC-001, DOC-002, DOC-003, DOC-004

**Description:**
Update .github/copilot-instructions.md after all README fixes are complete. Currently references old documentation that will be changed.

**Problem:**
- Copilot instructions reference specific README sections that will change
- Instructions need to reflect updated test runner docs
- References to structure of README.md will be outdated

**Solution:**
After completing DOC-001, DOC-002, DOC-003, DOC-004, DOC-005:
- Update command examples in copilot-instructions.md
- Update references to README structure
- Refresh test framework guidance

**Files to Change:**
- .github/copilot-instructions.md

**Acceptance Criteria:**
- [ ] All README references are current
- [ ] Command examples match new documentation
- [ ] Test framework guidance is accurate

**Related Issues:**
- Issue #9 from DOCUMENTATION_ANALYSIS.md (LOW severity)

---

## Feature Work

### FEAT-002: Evaluate Shared Library Integration for MFE2
**Requirement:** REQ-F006 (MFE2 Shared Library Integration)  
**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 8-16 hours  

**Description:**
Investigate and implement integration of mfe-shared library with MFE2 (React) to share state and services across frameworks.

**Problem:**
- MFE2 currently duplicates UserContext locally
- State isn't synced with Shell/MFE1 context
- Missing opportunity for code reuse

**Solution:**
- Research bridge patterns for Angular library → React usage
- Consider wrapper/adapter pattern
- Or create language-agnostic shared library interface

**Acceptance Criteria:**
- [ ] MFE2 can access UserContext from mfe-shared
- [ ] State is synchronized with Shell/MFE1
- [ ] No breaking changes to existing MFEs

**Related Requirement:**
- REQ-F006

---

### FEAT-003: Implement MFE Registry System
**Requirement:** REQ-F009 (Dynamic MFE Discovery)  
**Priority:** 🟢 LOW  
**Status:** ⏳ PENDING  
**Effort:** 16-24 hours  

**Description:**
Build auto-discovery or registry mechanism for MFEs to eliminate manual shell-config.json updates.

**Problem:**
- Currently: Manual updates to shell-config.json for each new MFE
- Slow iteration cycle for MFE onboarding
- Error-prone configuration management

**Solution:**
Consider approaches:
1. Registry server that MFEs register with at startup
2. DNS/service discovery (Consul, etc.)
3. Git-driven configuration (ArgoCD pattern)

**Acceptance Criteria:**
- [ ] New MFEs can be added without modifying shell-config.json
- [ ] System is backward compatible
- [ ] Configuration is auditable and versioned

**Related Requirement:**
- REQ-F009

---

## Testing Work

### TEST-001: Implement E2E Testing Framework
**Requirement:** REQ-F007 (E2E Testing Framework)  
**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 12-20 hours  

**Description:**
Build end-to-end testing framework for Shell + MFEs integration scenarios. Currently only unit tests exist.

**Problem:**
- Unit tests alone don't verify federation behavior
- Missing integration tests for cross-MFE communication
- No E2E tests for Shell routing and MFE loading

**Solution:**
- Implement Playwright tests
- Cover: Shell startup, MFE loading, routing, state sharing
- Test both standalone and integrated modes

**Acceptance Criteria:**
- [ ] E2E tests for Shell startup
- [ ] E2E tests for MFE1 loading and routing
- [ ] E2E tests for MFE2 loading
- [ ] E2E tests for cross-MFE state sharing

**Related Requirement:**
- REQ-F007

---

## Infrastructure Work

### DOCKER-001: Create Docker Compose Configuration
**Requirement:** REQ-F008 (Docker Compose Orchestration)  
**Priority:** 🟢 LOW  
**Status:** ⏳ PENDING  
**Effort:** 4-6 hours  

**Description:**
Build Docker Compose configuration for full-stack development and testing. Simplify startup from multiple manual commands to single `docker-compose up`.

**Problem:**
- Currently: Developers must start each container separately
- No clear orchestration
- Difficult to ensure all services start in correct order
- CI/CD integration is manual

**Solution:**
- Create docker-compose.yml for local development
- Create docker-compose.prod.yml for production
- Include service health checks
- Document usage

**Acceptance Criteria:**
- [ ] Single `docker-compose up` starts all services
- [ ] Services start in correct dependency order
- [ ] Health checks verify all services are ready
- [ ] Easy to switch between dev and prod

**Related Requirement:**
- REQ-F008

---

## Summary by Category

| Category | Pending | In Progress | Done |
|----------|---------|-------------|------|
| Documentation (DOC) | 8 | 0 | 1 |
| Features (FEAT) | 2 | 0 | 0 |
| Testing (TEST) | 1 | 0 | 0 |
| Infrastructure (DOCKER) | 1 | 0 | 0 |
| **TOTAL** | **12** | **0** | **1** |

---

## Work Dependencies

```
DOC-001 ✅ (Completed)
├── Addresses: REQ-F002, REQ-D002
└── No blocking dependencies

DOC-009 ⏳ (Blocked)
├── Depends on: DOC-001, DOC-002, DOC-003, DOC-004, DOC-005
└── Effort: 0.5 hours after blocking items complete

FEAT-002 ⏳ (Independent)
└── No blocking dependencies

FEAT-003 ⏳ (Independent)
└── No blocking dependencies

TEST-001 ⏳ (Independent)
└── No blocking dependencies

DOCKER-001 ⏳ (Independent)
└── No blocking dependencies
```

---

## Quick Navigation

- **All Requirements:** See REQUIREMENTS.md
- **Specific Task Testing:** See tasks/DOC-001.md
- **Root README Issues:** See DOCUMENTATION_ANALYSIS.md (legacy file, information now in REQUIREMENTS.md)
- **Architecture Details:** See REQUIREMENTS.md#Architecture Requirements

---

**Maintainer:** Development Team  
**Last Updated:** 2026-03-14  
**Next Review:** After DOC-001 UAT and DOC-002 completion
