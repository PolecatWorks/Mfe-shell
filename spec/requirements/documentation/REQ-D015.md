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

- [DOC-001: Fix MFE1 Test Runner Documentation](../WORK.md#DOC-001) — ✅ DONE
- [DOC-003: Replace shell-container README](../WORK.md#DOC-003) — ⏳ Pending
- [DOC-008: Update Angular CLI version references](../WORK.md#DOC-008) — ⏳ Pending

---

## Related Requirements

- [REQ-D014: Root README.md](REQ-D014.md)
- [REQ-F013: MFE Shell](../features/REQ-F013.md)
- [REQ-F010: MFE1 Remote](../features/REQ-F010.md)

---

**Last Updated:** 2026-03-14  
**Owner:** Documentation Team  
**Review Frequency:** When adding new containers or MFEs
