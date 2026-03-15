# REQ-D015: Container READMEs (Shell & MFE1)

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Documentation for individual container applications. Should provide MFE-specific guidance, not generic Angular CLI boilerplate.

---

## Rationale

- Each container has unique purpose and setup
- Developers need MFE-specific guidance
- Unclear documentation leads to setup errors
- Each README should explain its role in the federation

---

## Key Implementation Points

- MFE context header (what is this app, why does it exist)
- Shared library prerequisites (npm link info)
- Standalone vs. integrated running modes
- Accurate test runner documentation per container
- Version information matching package.json
- No generic Angular boilerplate

---

## Current Status

✅ **MFE1 Complete, ⚠️ Shell Pending**

- MFE1 README: Updated with MFE context (DOC-001 completed)
- Shell README: Still generic boilerplate, needs MFE context

---

## Implementation Results

### ✅ DOC-001: Fix MFE1 Test Runner Documentation — COMPLETED

**File Modified:** `mfe1-container/README.md` (Complete restructure)

**Changes Made:**

1. ✅ **Added MFE Context Header**
   - Clear statement: "This is a Micro Frontend (MFE)"
   - Explanation of role within architecture
   - Link to main README for architecture overview

2. ✅ **Added "About This MFE" Section**
   - Standalone mode: Run locally at http://localhost:3000
   - Integrated mode: Loaded by Shell at http://localhost:4200
   - Purpose: Serves routes via federation, shares UserContext

3. ✅ **Updated Shared Library Prerequisites**
   - Added note: "Run `make mfe1-shared` before local development"
   - Explains singleton linking behavior
   - Clarifies npm link requirement

4. ✅ **Clarified Test Runner**
   - Corrected to: Karma + Jasmine (accurate)
   - Removed generic boilerplate
   - Added note: "Shell uses different test runner (Vitest)"

5. ✅ **Updated Angular CLI Version**
   - Changed from: 19.2.19 (incorrect)
   - Changed to: 21.2.1 (correct, matches package.json)

6. ✅ **Added Cross-References**
   - Links to main README.md for architecture context
   - Explains MFE relationship to Shell

**User Acceptance Tests (8 scenarios):**

| Test | Status | Description |
|------|--------|-------------|
| MFE Context is Clear | ✅ PASS | First section identifies as MFE with role explanation |
| Shared Library Prerequisite | ✅ PASS | `make mfe1-shared` documented before dev setup |
| Test Runner Accurate | ✅ PASS | Karma + Jasmine correctly identified (not Vitest) |
| Angular Version Correct | ✅ PASS | 21.2.1 in docs matches package.json |
| Development Setup Works | ✅ PASS | npm install and dev server start successfully |
| Standalone vs. Integrated Clear | ✅ PASS | Both modes explained with ports and use cases |
| Production Build Documented | ✅ PASS | Build instructions present for federation |
| No Generic Boilerplate | ✅ PASS | MFE-specific content, no generic Angular docs |

**Completion:** 2026-03-14  
**Verified By:** User acceptance testing

---

## Work Items

This requirement is implemented through the following work items:

### ✅ DOC-001: Fix MFE1 Test Runner Documentation — COMPLETED

**Priority:** 🔴 CRITICAL  
**Status:** ✅ DONE  
**Effort:** 0.25 hours (15 minutes)  
**Completion Date:** 2026-03-14  

**Problem:** Original README was generic Angular CLI boilerplate with no MFE context, missing prerequisite for npm link, and incorrect test runner documentation (said Vitest instead of Karma+Jasmine).

**Solution:** Updated mfe1-container/README.md with MFE context, accurate test runner info, shared library prerequisite, and correct Angular version.

**Implementation Details:** See "Implementation Results" section above.

---

### ⏳ DOC-003: Replace shell-container README with MFE Context Documentation — PENDING

**Priority:** 🟠 HIGH  
**Status:** ⏳ PENDING  
**Effort:** 1 hour (60 minutes)  

**Description:** Replace generic Angular CLI boilerplate in shell-container/README.md with MFE-specific documentation covering Shell's role as federation host, how to boot the system, and important development considerations.

**Problem:**
- Current README is generic Angular CLI boilerplate
- No explanation of Shell's special role as federation host
- Missing information about booting MFEs, debug ports, federation bootstrap

**Solution:** Restructure to include:
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

**Related Issues:** Issue #5 from GAP_ANALYSIS.md (MEDIUM severity)

---

### ⏳ DOC-008: Update Angular CLI Version References — PENDING

**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 0.25 hours (15 minutes)  

**Description:** Update outdated Angular CLI version references in container README files. Some files reference old versions that don't match the actual package.json.

**Problem:**
- README files may reference Angular CLI 19.x but actual version is 21.x
- Inconsistent version references across documentation
- Developers confused about which Angular version to use

**Solution:** Audit and update all Angular CLI version references to match actual package.json versions in each container.

**Files to Change:**
- mfe1-container/README.md (may need version update)
- shell-container/README.md (may need version update)

**Acceptance Criteria:**
- [ ] All Angular CLI version references match package.json
- [ ] No outdated version numbers in documentation
- [ ] Documentation is consistent across containers

---

## Related Requirements

- [REQ-D014: Root README.md](REQ-D014.md)
- [REQ-F013: MFE Shell](../features/REQ-F013.md)
- [REQ-F010: MFE1 Remote](../features/REQ-F010.md)

---

**Last Updated:** 2026-03-14  
**Owner:** Documentation Team  
**Review Frequency:** When adding new containers or MFEs
