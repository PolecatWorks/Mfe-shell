# REQ-D002: Container READMEs (Shell & MFE1)

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

## Work Items

- [DOC-001: Fix MFE1 Test Runner Documentation](../WORK.md#DOC-001) — ✅ DONE
- [DOC-003: Replace shell-container README](../WORK.md#DOC-003) — ⏳ Pending
- [DOC-008: Update Angular CLI version references](../WORK.md#DOC-008) — ⏳ Pending

---

## Related Requirements

- [REQ-D001: Root README.md](REQ-D001.md)
- [REQ-F001: MFE Shell](../features/REQ-F001.md)
- [REQ-F002: MFE1 Remote](../features/REQ-F002.md)

---

**Last Updated:** 2026-03-14  
**Owner:** Documentation Team  
**Review Frequency:** When adding new containers or MFEs
