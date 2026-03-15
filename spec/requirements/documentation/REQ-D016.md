# REQ-D016: Copilot Instructions

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

AI assistant instructions for efficient repository navigation and task execution. Located at `.github/copilot-instructions.md`.

---

## Rationale

- Helps AI assistants understand project structure
- Speeds up development tasks
- Reduces back-and-forth clarifications
- Documents best practices and conventions

---

## Key Implementation Points

- Tech stack and build commands
- Architecture overview
- Key file locations
- Testing approach per container
- Deployment procedures
- Troubleshooting common issues

---

## Current Status

✅ **Implemented (needs updates after README fixes)**

Instructions exist but will need updates after other doc fixes complete.

---

## Work Items

### ⏳ DOC-009: Update Copilot Instructions After README Fixes — PENDING (BLOCKED)

**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 0.5 hours (30 minutes)  
**Blocked By:** DOC-001 ✅ DONE, DOC-002, DOC-003, DOC-004, DOC-005

**Description:** Update .github/copilot-instructions.md after all README fixes are complete. Currently references old documentation that will be changed.

**Problem:**
- Copilot instructions reference specific README sections that will change
- Instructions need to reflect updated test runner docs
- References to structure of README.md will be outdated

**Solution:** After completing DOC-001, DOC-002, DOC-003, DOC-004, DOC-005:
- Update command examples in copilot-instructions.md
- Update references to README structure
- Refresh test framework guidance

**Files to Change:**
- .github/copilot-instructions.md

**Acceptance Criteria:**
- [ ] All README references are current
- [ ] Command examples match new documentation
- [ ] Test framework guidance is accurate

**Related Issues:** Issue #9 from GAP_ANALYSIS.md (LOW severity)

**Dependency Chain:**
- Blocked by: DOC-002, DOC-003, DOC-004, DOC-005 (must complete these first)
- Related to: REQ-D014, REQ-D015 (will reference updated docs)

---

## Related Requirements

- [REQ-D014: Root README.md](REQ-D014.md)
- [REQ-D015: Container READMEs](REQ-D015.md)

---

**Last Updated:** 2026-03-14  
**Owner:** Documentation Team  
**Review Frequency:** After README updates
