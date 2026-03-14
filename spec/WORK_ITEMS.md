# Work Items Tracking

**Last Updated:** 2026-03-14  
**Total Items:** 15  
**Status:** 0 Done, 0 In Progress, 15 Pending

---

## Quick Status

| Priority | Pending | In Progress | Done |
|----------|---------|-------------|------|
| 🔴 Critical | 1 | 0 | 0 |
| 🟠 High | 4 | 0 | 0 |
| 🟡 Medium | 8 | 0 | 0 |
| 🟢 Low | 2 | 0 | 0 |

---

## Documentation Fixes (IMMEDIATE - Week 1)

### DOC-001: Fix MFE1 Test Runner Documentation
**Priority:** 🔴 **CRITICAL**  
**Status:** ⏳ Pending  
**Effort:** 0.25 hours (15 minutes)  
**Owner:** [TBD]

**Description:**
Update mfe1-container/README.md line 41 to clarify the actual test runner.

**Problem:**
- Current: "To execute unit tests with the Karma test runner"
- Reality: Uses "ng test" which may use different runner
- Impact: Developers follow incorrect test documentation

**Solution:**
Verify actual test runner and update documentation accordingly. Consider documenting testing setup more explicitly or directing developers to root README.md for testing details.

**Files to Change:**
- `mfe1-container/README.md` (line 41)

**Acceptance Criteria:**
- [ ] Test runner clearly identified
- [ ] Documentation matches actual implementation
- [ ] Developer can follow docs without confusion

**Related:**
- Issue #1 in DOCUMENTATION_ANALYSIS.md
- [A1: Native Federation Architecture](SPECIFICATIONS.md#a1-native-federation-architecture)

---

### DOC-002: Add npm link Prerequisite to Quick Start
**Priority:** 🟠 **HIGH**  
**Status:** ⏳ Pending  
**Effort:** 0.5 hours (30 minutes)  
**Owner:** [TBD]

**Description:**
Add npm link prerequisite documentation to README.md Quick Start section (lines 96-97).

**Problem:**
- Current: Quick Start suggests running `npm start` without mentioning npm link
- Users following Quick Start get npm resolution errors
- Manual setup section documents this, but isn't referenced from Quick Start

**Solution:**
Either:
1. Add prerequisite step to Quick Start: "Run `make mfe1-shared` before starting MFE1"
2. Integrate npm link into Quick Start flow
3. Add cross-reference from Quick Start to manual setup

**Files to Change:**
- `README.md` (root, lines 96-97 area)

**Acceptance Criteria:**
- [ ] Quick Start clearly documents npm link requirement
- [ ] Users can follow steps sequentially without errors
- [ ] No module resolution errors when running mfe1-dev

**Related:**
- Issue #3 in DOCUMENTATION_ANALYSIS.md
- Issue #6 in DOCUMENTATION_ANALYSIS.md

---

### DOC-004: Update Test Framework Documentation in Tech Stack
**Priority:** 🟠 **HIGH**  
**Status:** ⏳ Pending  
**Effort:** 0.25 hours (15 minutes)  
**Owner:** [TBD]

**Description:**
Update README.md line 10 to accurately reflect per-container test framework setup.

**Problem:**
- Current: "Testing: Vitest" (uniform across all apps)
- Reality: 
  - Shell: Vitest
  - MFE1: Karma/ng test
  - MFE2: None configured
- Impact: Incomplete documentation, developer confusion

**Solution:**
Update Tech Stack section to clarify per-application testing setup:
```markdown
- **Testing**: Vitest (Shell), Karma/ng test (MFE1), None configured (MFE2)
```

**Files to Change:**
- `README.md` (root, line 10)

**Acceptance Criteria:**
- [ ] Tech Stack accurately reflects all three apps' test setup
- [ ] Developers know which test framework to use for each app
- [ ] No confusion about testing approach

**Related:**
- Issue #4 in DOCUMENTATION_ANALYSIS.md
- Issue #1 in DOCUMENTATION_ANALYSIS.md

---

### DOC-005: Update Docker Port Mapping Diagram
**Priority:** 🟠 **HIGH**  
**Status:** ⏳ Pending  
**Effort:** 0.5 hours (30 minutes)  
**Owner:** [TBD]

**Description:**
Update Docker architecture diagram in README.md to show external→internal port mapping.

**Problem:**
- Current: Diagram only shows "Port 8080" for all containers
- Reality: External ports (4200, 3000, 3002) map to container port 8080
- Impact: Developers confused about port relationships

**Solution:**
Update diagram (lines 180-182) to show:
```
Browser →|Port 4200| Shell[Container<br/>Port 8080]
Browser →|Port 3000| MFE1[Container<br/>Port 8080]
Browser →|Port 3002| MFE2[Container<br/>Port 8080]
```

**Files to Change:**
- `README.md` (root, lines 173-191, diagram section)

**Acceptance Criteria:**
- [ ] Diagram shows both external and internal ports
- [ ] Relationship is clear: external→container internal
- [ ] Diagram matches port configuration explanation
- [ ] Developers understand port mapping without confusion

**Related:**
- Issue #2 in DOCUMENTATION_ANALYSIS.md

---

## Documentation Improvements (BEFORE RELEASE)

### DOC-003: Replace mfe-shell-container README with MFE-Specific Docs
**Priority:** 🟠 **HIGH**  
**Status:** ⏳ Pending  
**Effort:** 1-1.5 hours (45 minutes)  
**Owner:** [TBD]

**Description:**
Replace mfe-shell-container/README.md (generic Angular CLI boilerplate) with MFE-specific documentation.

**Problem:**
- Current: Auto-generated Angular CLI template with no MFE context
- Missing: Federation setup, shared library, Shell's role, dynamic routing
- Impact: Shell developers have no architectural guidance

**Solution:**
Replace entire file with MFE-specific documentation explaining:
1. Shell's role as federation host
2. How Shell loads and manages remotes
3. Configuration via shell-config.json
4. Shared library setup and singleton pattern
5. Development workflow specific to Shell
6. Cross-reference to root README.md for full architecture

**Files to Change:**
- `mfe-shell-container/README.md`

**Acceptance Criteria:**
- [ ] Documentation explains Shell's MFE role
- [ ] Shared library setup clearly documented
- [ ] Federation configuration explained
- [ ] Developers understand architecture without reading root README

**Related:**
- Issue #5 in DOCUMENTATION_ANALYSIS.md

---

### DOC-006: Create Formal Architecture Specifications
**Priority:** 🟡 **MEDIUM**  
**Status:** ⏳ Pending  
**Effort:** 2-3 hours  
**Owner:** [TBD]

**Description:**
Create formal specification documents for key architecture components in `spec/architecture/` directory.

**Components to Document:**
1. FEDERATION_ARCHITECTURE.md - Native Federation setup
2. SHARED_LIBRARY.md - Singleton pattern and npm link
3. SHELL_ROUTING.md - Dynamic routing system
4. DOCKER_DEPLOYMENT.md - Container orchestration

**Files to Change:**
- Create: `spec/architecture/FEDERATION_ARCHITECTURE.md`
- Create: `spec/architecture/SHARED_LIBRARY.md`
- Create: `spec/architecture/SHELL_ROUTING.md`
- Create: `spec/architecture/DOCKER_DEPLOYMENT.md`

**Acceptance Criteria:**
- [ ] All architecture decisions documented
- [ ] Why each component exists explained
- [ ] Integration points clear
- [ ] Constraints and trade-offs documented

**Related:**
- Issue #5 in DOCUMENTATION_ANALYSIS.md

---

### DOC-007: Clarify Docker MFE1 Dependency Intent
**Priority:** 🟡 **MEDIUM**  
**Status:** ⏳ Pending  
**Effort:** 0.5 hours (30 minutes)  
**Owner:** [TBD]

**Description:**
Verify and clarify the intent behind MFE1 Docker build depending on Shell Docker build.

**Problem:**
- Current: README.md line 154 says "this will also build the shell as a dependency"
- Question: Is this intentional or accidental?
- Implication: Makefile line 50-51 shows `mfe1-docker: mfe-shell-docker`

**Solution:**
1. Verify architectural intent with team
2. If intentional: Document reason in README and Dockerfile
3. If accidental: Remove dependency or document workaround

**Files to Verify:**
- `Makefile` (lines 50-51)
- `mfe1-container/Dockerfile`
- `mfe-shell-container/Dockerfile`

**Files to Change:**
- `README.md` (line 154 comment)
- Possibly: `Makefile` (if dependency is accidental)

**Acceptance Criteria:**
- [ ] Docker dependency intent is clear
- [ ] Documentation explains why if intentional
- [ ] No confusion about build requirements

**Related:**
- Issue #7 in DOCUMENTATION_ANALYSIS.md

---

### DOC-008: Update Angular CLI Version References
**Priority:** 🟢 **LOW**  
**Status:** ⏳ Pending  
**Effort:** 0.1 hours (5 minutes)  
**Owner:** [TBD]

**Description:**
Update outdated Angular CLI version reference in mfe1-container/README.md.

**Problem:**
- Current: "Angular CLI version 19.2.19" (line 3)
- Reality: package.json shows "@angular/cli": "^21.2.1"
- Impact: Creates confusion about project versions (low impact)

**Solution:**
Update version reference to 21.2.1 or remove version mention entirely.

**Files to Change:**
- `mfe1-container/README.md` (line 3)

**Acceptance Criteria:**
- [ ] Version information is accurate or removed
- [ ] No confusion about project versions

**Related:**
- Issue #8 in DOCUMENTATION_ANALYSIS.md

---

### DOC-009: Update copilot-instructions.md with README Fixes
**Priority:** 🟢 **LOW**  
**Status:** ⏳ Pending  
**Effort:** 0.5 hours (30 minutes)  
**Owner:** [TBD]

**Description:**
Update copilot-instructions.md to reflect fixes made to root README.md.

**Problem:**
- copilot-instructions.md is synced with root README.md
- When README is fixed, copilot-instructions should be updated too
- This task should be done after DOC-002, DOC-004, DOC-005 are complete

**Solution:**
Review changes made to README.md and apply equivalent updates to copilot-instructions.md to keep them synchronized.

**Files to Change:**
- `.github/copilot-instructions.md`

**Acceptance Criteria:**
- [ ] copilot-instructions.md reflects latest README changes
- [ ] No stale information in AI instructions
- [ ] Instructions remain accurate

**Related:**
- Depends on: DOC-002, DOC-004, DOC-005
- See: DOCUMENTATION_ANALYSIS.md

---

## Feature Enhancements (PLANNED)

### FEAT-001: Implement E2E Testing Framework
**Priority:** 🟡 **MEDIUM**  
**Status:** ⏳ Pending  
**Effort:** 12-20 hours  
**Owner:** [TBD]

**Description:**
Implement end-to-end testing framework for Shell + MFEs integration testing.

**Problem:**
- Current: Only unit tests (Vitest, Karma)
- Gap: No integration tests for federation
- Need: Test Shell loading MFEs, shared state, routing, etc.

**Suggested Approach:**
Use Playwright for cross-framework testing (works with Angular, React, vanilla JS)

**Files to Create:**
- `e2e/` directory with test suite
- Configure Playwright
- Add CI workflow for E2E tests

**Acceptance Criteria:**
- [ ] E2E tests can verify federation works
- [ ] Tests can run in CI/CD pipeline
- [ ] Tests cover: Shell loading, MFE integration, shared state
- [ ] CI passes before merge

**Related:**
- [SPECIFICATIONS.md: F7 E2E Testing](SPECIFICATIONS.md#f7-e2e-testing-framework)

---

### FEAT-002: Consider MFE2 Shared Library Integration
**Priority:** 🟡 **MEDIUM**  
**Status:** ⏳ Pending  
**Effort:** 8-16 hours  
**Owner:** [TBD]

**Description:**
Investigate and implement shared library integration for MFE2 (React).

**Problem:**
- Current: MFE2 duplicates UserContext locally
- Not using mfe-shared for state management
- Inconsistent state between Shell/MFE1 vs MFE2

**Challenges:**
- mfe-shared is Angular-based
- MFE2 is React
- Need bridge or refactoring approach

**Options to Explore:**
1. Extract mfe-shared to language-agnostic form
2. Create React wrapper for mfe-shared
3. Use state management library (Redux, Zustand, etc.)
4. Keep current approach but document why

**Acceptance Criteria:**
- [ ] Decision made: implement or document why not
- [ ] If implementing: shared state working between all MFEs
- [ ] Tests verify state consistency

**Related:**
- [SPECIFICATIONS.md: F6 MFE2 Shared Library](SPECIFICATIONS.md#f6-mfe2-shared-library-integration)

---

### FEAT-003: Implement MFE Registry/Discovery
**Priority:** 🟢 **LOW**  
**Status:** ⏳ Pending  
**Effort:** 16-24 hours  
**Owner:** [TBD]

**Description:**
Implement automatic MFE discovery without manual shell-config.json updates.

**Problem:**
- Current: shell-config.json must be manually updated for each MFE
- Friction: Developers must know about config file and format
- Improvement: Auto-discovery or registry system

**Suggested Approach:**
1. MFE registry (central or distributed)
2. Runtime discovery from known registry
3. Health checks and auto-registration

**Files to Create:**
- Registry implementation
- MFE registration mechanism
- Shell loader updates

**Acceptance Criteria:**
- [ ] New MFE can be added without manual config
- [ ] Discovery is automatic or minimal config
- [ ] Backwards compatible with existing setup

**Related:**
- [SPECIFICATIONS.md: F9 Dynamic MFE Discovery](SPECIFICATIONS.md#f9-dynamic-mfe-discovery)

---

## Architecture Enhancements

### ARCH-001: Document Federation Configuration Details
**Priority:** 🟡 **MEDIUM**  
**Status:** ⏳ Pending  
**Effort:** 1-2 hours  
**Owner:** [TBD]

**Description:**
Document detailed federation configuration for Shell, MFE1, and MFE2.

**Components:**
- Shell federation config (singleton sharing)
- MFE1 federation config (exposing routes)
- MFE2 federation config (Esbuild setup)
- Why certain packages are shared vs. skipped

**Files to Create/Update:**
- `spec/architecture/FEDERATION_ARCHITECTURE.md`
- Update federation.config.js comments

**Acceptance Criteria:**
- [ ] All federation configs documented
- [ ] Rationale for sharing decisions explained
- [ ] New developers can understand setup

**Related:**
- [SPECIFICATIONS.md: A1 Native Federation](SPECIFICATIONS.md#a1-native-federation-architecture)

---

## Infrastructure

### DOCKER-001: Create Docker Compose for Development
**Priority:** 🟢 **LOW**  
**Status:** ⏳ Pending  
**Effort:** 4-6 hours  
**Owner:** [TBD]

**Description:**
Create docker-compose.yml for simplified full-stack development.

**Current Approach:**
- Manual: Start each container separately
- Effort: Multiple terminal windows, manual coordination

**Improvement:**
- Single command: `docker-compose up`
- All services start together
- Port mapping handled automatically
- Network configured automatically

**Files to Create:**
- `docker-compose.yml`
- `docker-compose.dev.yml` (optional for dev-specific overrides)
- Update documentation

**Acceptance Criteria:**
- [ ] `docker-compose up` starts full stack
- [ ] All services communicate correctly
- [ ] Developers can access at documented ports
- [ ] Stops cleanly with Ctrl+C

**Related:**
- [SPECIFICATIONS.md: F8 Docker Compose](SPECIFICATIONS.md#f8-docker-compose-orchestration)

---

## Testing

### TEST-001: Comprehensive E2E Test Suite
**Priority:** 🟡 **MEDIUM**  
**Status:** ⏳ Pending  
**Effort:** 12-20 hours  
**Owner:** [TBD]

**Description:**
Create comprehensive E2E test suite covering Shell + MFE integration.

**Test Scenarios:**
- Shell loads successfully
- Shell loads MFE1 (Angular)
- Shell loads MFE2 (React)
- Navigation between MFEs works
- Shared state persists across MFEs
- Route animations work
- Error scenarios handled

**Technology:**
- Playwright recommended
- CI integration in GitHub Actions

**Files to Create:**
- `e2e/` directory structure
- Playwright config
- Test files
- CI workflow update

**Acceptance Criteria:**
- [ ] All test scenarios covered
- [ ] Tests pass in CI
- [ ] Tests can be run locally
- [ ] Coverage > 80% of user flows

**Related:**
- [FEAT-001: E2E Testing Framework](#feat-001-implement-e2e-testing-framework)

---

## Summary by Category

### Documentation (9 items)
- Critical: 1 (DOC-001)
- High: 4 (DOC-002, DOC-003, DOC-004, DOC-005)
- Medium: 2 (DOC-006, DOC-007)
- Low: 2 (DOC-008, DOC-009)

### Features (3 items)
- Medium: 2 (FEAT-001, FEAT-002)
- Low: 1 (FEAT-003)

### Architecture (1 item)
- Medium: 1 (ARCH-001)

### Infrastructure (1 item)
- Low: 1 (DOCKER-001)

### Testing (1 item)
- Medium: 1 (TEST-001)

---

## Work Flow

### Getting Started
1. Review this list
2. Pick highest priority item (start with 🔴 CRITICAL)
3. Update status to "In Progress"
4. Make changes
5. Update status to "Done"
6. Move to next item

### Updating Status
Change status field from:
- ⏳ Pending → 🔄 In Progress → ✅ Done
- Or ❌ Blocked if stuck

### Dependencies
Some items depend on others completing first:
- DOC-009 depends on DOC-002, DOC-004, DOC-005
- Architecture specs should be done before feature work

---

## Key Dates

- **2026-03-14**: Initial work items created
- **Target EOW**: Complete all CRITICAL and HIGH priority items
- **Target EOM**: Complete all MEDIUM priority items
- **TBD**: LOW priority items

---

**Maintained By:** Development Team  
**Last Updated:** 2026-03-14  
**Next Review:** Weekly during development
