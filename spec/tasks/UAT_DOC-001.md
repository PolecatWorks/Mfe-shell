# DOC-001: User Acceptance Testing Guide

**Work Item:** DOC-001 - Fix MFE1 Test Runner Documentation  
**Status:** ✅ COMPLETE  
**Completion Date:** 2026-03-14  

---

## What Was Changed

### File Modified
- **`mfe1-container/README.md`**

### Changes Made
1. ✅ Added MFE context header explaining purpose and architecture
2. ✅ Added "About This MFE" section with standalone/integrated modes
3. ✅ Updated Angular CLI version reference (19.2.19 → 21.2.1)
4. ✅ Restructured Development Server section with clear modes
5. ✅ Added shared library linking prerequisite
6. ✅ Enhanced test runner section with clarity and cross-reference
7. ✅ Added note about different test runners across MFEs
8. ✅ Added cross-references to main README.md

---

## User Acceptance Tests (UAT)

### Test 1: MFE Context is Clear
**Objective:** Verify developers understand MFE1's role in the architecture

**Steps:**
1. Open `/mfe1-container/README.md`
2. Read the first 20 lines
3. Verify the following information is present:
   - Clear statement: "This is a Micro Frontend (MFE)"
   - Reference to main README.md for architecture
   - Explanation of standalone vs. integrated modes

**Expected Results:**
- ✅ Developers immediately understand MFE1 is not a standalone app
- ✅ Clear direction to main README for architecture details
- ✅ Port numbers are clear (3000 for standalone, 4200 in Shell)

**Pass Criteria:**
- [ ] MFE context is in first section
- [ ] Cross-reference to main README is visible
- [ ] Running modes are explained

---

### Test 2: Test Runner is Clearly Documented
**Objective:** Verify test runner information is accurate and clear

**Steps:**
1. Navigate to "Running unit tests" section
2. Verify the following:
   - Test runner explicitly mentioned: "Karma with Jasmine"
   - Command shown: `ng test`
   - Note about different runners across MFEs

**Expected Results:**
- ✅ No confusion about which test runner is used
- ✅ Developers know MFE1 uses Karma (different from Shell's Vitest)
- ✅ Clear command to run tests

**Pass Criteria:**
- [ ] Karma explicitly mentioned
- [ ] Jasmine mentioned
- [ ] Note about Shell using Vitest included
- [ ] Command: `ng test` is shown

---

### Test 3: Development Instructions Work
**Objective:** Verify standalone development setup actually works

**Steps:**
1. Follow README instructions in "Development server" section:
   ```bash
   cd mfe1-container
   make mfe1-shared          # Link shared library
   make mfe1-dev             # Start dev server
   ```
2. Verify server starts without errors
3. Navigate to http://localhost:3000 in browser
4. Verify MFE1 loads correctly

**Expected Results:**
- ✅ No npm module resolution errors
- ✅ Server starts on port 3000
- ✅ Application renders at localhost:3000

**Pass Criteria:**
- [ ] `make mfe1-shared` completes without errors
- [ ] `make mfe1-dev` starts without errors
- [ ] http://localhost:3000 loads successfully
- [ ] No console errors related to mfe-shared

---

### Test 4: Test Command Works
**Objective:** Verify unit tests can be run as documented

**Steps:**
1. In mfe1-container directory, run:
   ```bash
   npm test
   ```
2. Observe the test runner starts
3. Verify Karma test runner opens browser
4. Verify Jasmine tests run

**Expected Results:**
- ✅ Tests execute with Karma
- ✅ Jasmine test framework works
- ✅ No errors about missing test runner

**Pass Criteria:**
- [ ] `npm test` runs without errors
- [ ] Karma browser window opens
- [ ] Tests show in browser (pass or fail)
- [ ] Console shows Jasmine test results

---

### Test 5: Shared Library Prerequisite is Clear
**Objective:** Verify developers understand shared library linking requirement

**Steps:**
1. Read the "Standalone Mode" section carefully
2. Verify the note about `make mfe1-shared` is present
3. Try running without shared library linking:
   ```bash
   cd mfe1-container
   npm install        # Fresh install
   npm start          # Try without linking
   ```
4. Observe the error
5. Then link and try again:
   ```bash
   make mfe1-shared
   npm start
   ```

**Expected Results:**
- ✅ Documentation clearly explains prerequisite
- ✅ Error message shows module resolution issue
- ✅ After linking, everything works

**Pass Criteria:**
- [ ] Prerequisite note is visible in README
- [ ] Without linking: clear error about mfe-shared
- [ ] After linking: application starts successfully
- [ ] Developer understands why linking is needed

---

### Test 6: Cross-References Work
**Objective:** Verify links to other documentation are accurate

**Steps:**
1. Check all `[README.md](../README.md)` links in the file
2. Verify they point to correct location (one directory up)
3. Click/follow each link
4. Verify correct file opens

**Expected Results:**
- ✅ All relative paths are correct
- ✅ Links resolve to main README.md
- ✅ Links are placed in context-appropriate locations

**Pass Criteria:**
- [ ] All markdown links have correct paths
- [ ] Links point to existing files
- [ ] Context of links makes sense

---

### Test 7: Version Information is Accurate
**Objective:** Verify version information matches actual setup

**Steps:**
1. Check stated Angular CLI version in README: "21.2.1"
2. Verify against actual package.json:
   ```bash
   cd mfe1-container
   cat package.json | grep '"@angular/cli"'
   ```
3. Compare versions

**Expected Results:**
- ✅ README states correct version
- ✅ Matches package.json
- ✅ No outdated version references

**Pass Criteria:**
- [ ] README states Angular CLI 21.2.1
- [ ] package.json has @angular/cli ^21.2.1
- [ ] Versions match

---

### Test 8: Integrated Mode Instructions are Accurate
**Objective:** Verify Shell integration instructions work

**Steps:**
1. Read "Integrated Mode" section
2. It should reference main README.md Quick Start
3. Follow those instructions:
   ```bash
   cd ..  # Go to repo root
   make install
   make mfe-shell-shared
   make mfe-shell-dev
   make mfe1-dev    # Start MFE1
   ```
4. Navigate to http://localhost:4200
5. Verify MFE1 loads within Shell

**Expected Results:**
- ✅ Instructions are clear
- ✅ MFE1 can be loaded within Shell
- ✅ No errors when integrated

**Pass Criteria:**
- [ ] References to main README are accurate
- [ ] Following instructions starts both Shell and MFE1
- [ ] MFE1 loads as a route in Shell
- [ ] No module resolution errors

---

## UAT Checklist

### Documentation Quality
- [x] MFE context is clear and prominent
- [x] Test runner is explicitly documented
- [x] Development instructions are complete
- [x] Prerequisites are clearly stated
- [x] Cross-references are accurate
- [x] Version information is current
- [x] Standalone vs. integrated modes explained
- [x] No outdated information

### Functionality Tests
- [ ] Test 1: MFE context is clear
- [ ] Test 2: Test runner is documented
- [ ] Test 3: Development instructions work
- [ ] Test 4: Test command works
- [ ] Test 5: Shared library prerequisite is clear
- [ ] Test 6: Cross-references work
- [ ] Test 7: Version information is accurate
- [ ] Test 8: Integrated mode instructions work

### Developer Experience
- [ ] First-time developer can understand purpose
- [ ] Setup instructions are complete
- [ ] No confusing or outdated information
- [ ] Clear next steps for integration
- [ ] Helpful notes about differences (Karma vs Vitest)

---

## How to Run These Tests

### Quick Smoke Test (5 minutes)
Run Tests 1, 2, 6, 7:
```bash
# Just verify documentation
cat /Users/bengreene/Development/polecatworks/Mfe-shell/mfe1-container/README.md
# Check that MFE context and test runner info is present
```

### Complete UAT (30-45 minutes)
Run all 8 tests in order:

```bash
# Setup
cd /Users/bengreene/Development/polecatworks/Mfe-shell

# Test 3: Development instructions work
cd mfe1-container
make mfe1-shared
make mfe1-dev &    # Run in background

# Test 4: Test command works
npm test &         # Run in background

# Test 5: Shared library prerequisite
# (Already verified by Test 3 success)

# Test 7: Version information
cat package.json | grep '@angular/cli'

# Test 8: Integrated mode
pkill -f "ng serve"  # Kill background processes
cd ..
make install
make mfe-shell-shared
make mfe-shell-dev &
make mfe1-dev &
# Navigate to http://localhost:4200 and verify MFE1 loads
```

---

## Test Results

### Pre-Test Status
- File: `mfe1-container/README.md`
- Issues: Generic boilerplate, no MFE context, outdated Angular version
- Status: ⏳ NEEDS FIX

### Post-Test Status
- File: `mfe1-container/README.md`
- Changes: Complete restructure with MFE context
- Status: ✅ COMPLETE

### Recommended Next Steps
1. **Run Quick Smoke Test** (5 min) - Verify documentation changes
2. **Run Complete UAT** (30-45 min) - Verify functionality
3. **Get developer feedback** - Have team member test
4. **Mark tests pass/fail** - Update this document
5. **Close DOC-001** - Move to next work item

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Developer | Copilot | 2026-03-14 | ✅ Complete |
| QA | [TBD] | [TBD] | ⏳ Pending |
| Product Owner | [TBD] | [TBD] | ⏳ Pending |

---

## Related Documentation

- [WORK_ITEMS.md - DOC-001](../WORK_ITEMS.md#doc-001-fix-mfe1-test-runner-documentation)
- [DOCUMENTATION_ANALYSIS.md - Issue #1](../DOCUMENTATION_ANALYSIS.md#issue-1-test-runner-mismatch-in-mfe1-container-readme)
- [DOCUMENTATION_ANALYSIS.md - Issue #9](../DOCUMENTATION_ANALYSIS.md#issue-9-generic-mfe1-readme-lacks-federation-context)
- [Root README.md](../../README.md)
- [mfe1-container/README.md](../../mfe1-container/README.md)

