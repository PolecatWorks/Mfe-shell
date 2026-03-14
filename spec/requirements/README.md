# Requirements Index

This directory contains all system requirements organized by category. Each requirement is a standalone file that can be versioned, updated, and superseded independently.

**Last Updated:** 2026-03-14  
**Total Active Requirements:** 12  
**Total Proposed Requirements:** 5  
**Total Superseded Requirements:** 0  

---

## Architecture Requirements

Core architectural decisions and patterns.

| ID | Name | Status | Version |
|:---|:-----|:-------|:--------|
| [REQ-A001](architecture/REQ-A001.md) | Native Federation Architecture | ACTIVE | 1.0 |
| [REQ-A002](architecture/REQ-A002.md) | Shared Library (mfe-shared) Singleton Pattern | ACTIVE | 1.0 |
| [REQ-A003](architecture/REQ-A003.md) | Shell Dynamic Routing System | ACTIVE | 1.0 |
| [REQ-A004](architecture/REQ-A004.md) | Docker Deployment & Containerization | ACTIVE | 1.0 |

---

## Feature Requirements

Implemented and proposed features.

| ID | Name | Status | Version |
|:---|:-----|:--------|:--------|
| [REQ-F005](features/REQ-F005.md) | MFE Shell (Angular 21) | ACTIVE | 1.0 |
| [REQ-F006](features/REQ-F006.md) | MFE1 Remote (Angular 21) | ACTIVE | 1.0 |
| [REQ-F007](features/REQ-F007.md) | MFE2 Remote (React 18) | ACTIVE | 1.0 |
| [REQ-F008](features/REQ-F008.md) | Native Federation Configuration | ACTIVE | 1.0 |
| [REQ-F009](features/REQ-F009.md) | CI/CD Workflows | ACTIVE | 1.0 |
| [REQ-F010](features/REQ-F010.md) | MFE2 Shared Library Integration | PROPOSED | 1.0 |
| [REQ-F011](features/REQ-F011.md) | E2E Testing Framework | PROPOSED | 1.0 |
| [REQ-F012](features/REQ-F012.md) | Docker Compose Orchestration | PROPOSED | 1.0 |
| [REQ-F013](features/REQ-F013.md) | Dynamic MFE Discovery | PROPOSED | 1.0 |

---

## Documentation Requirements

Documentation specifications and improvements.

| ID | Name | Status | Version |
|:---|:-----|:--------|:--------|
| [REQ-D014](documentation/REQ-D014.md) | Root README.md | ACTIVE | 1.0 |
| [REQ-D015](documentation/REQ-D015.md) | Container READMEs (Shell & MFE1) | ACTIVE | 1.0 |
| [REQ-D016](documentation/REQ-D016.md) | Copilot Instructions | ACTIVE | 1.0 |
| [REQ-D017](documentation/REQ-D017.md) | Architecture Documentation Specification | PROPOSED | 1.0 |

---

## Summary

| Status | Count | Examples |
|--------|-------|----------|
| **ACTIVE** | 12 | REQ-A001, REQ-F005, REQ-D014, etc. |
| **PROPOSED** | 5 | REQ-F010, REQ-F011, REQ-F012, REQ-F013, REQ-D017 |
| **SUPERSEDED** | 0 | (None yet - versioning ready) |

---

## How Supersession Works

When a requirement evolves or changes:

1. **Create new version** (e.g., REQ-001 v2.0)
2. **Mark old version as superseded** in header
3. **Preserve old file** for historical reference
4. **Update work items** to reference new requirement

**Example:**
```
REQ-001-v2.md (new file)
  Status: ACTIVE
  Version: 2.0
  Supersedes: REQ-001 v1.0
  Changes: Added lazy-loaded remotes
  
REQ-001-v1.md (old file, archived or renamed)
  Status: SUPERSEDED
  Superseded by: REQ-001 v2.0
```

---

## File Format

Each requirement file follows this template:

```markdown
# REQ-###: [Name]

**Status:** ACTIVE | PROPOSED | SUPERSEDED  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None

## Description
What this requirement is and why it matters.

## Rationale
Why this design was chosen.

## Key Implementation Points
- Point 1
- Point 2
- Point 3

## Status
✅ Implemented | ⏳ Pending | 🔄 In Progress

## Work Items
Links to WORK.md items that implement this:
- DOC-001: [Link]
```

---

## Navigation

- **All Requirements:** This file (you are here)
- **Architecture Details:** See `architecture/` subdirectory
- **Feature Details:** See `features/` subdirectory
- **Documentation Details:** See `documentation/` subdirectory
- **Work Tracking:** See `../WORK.md`
- **System Guide:** See `../README.md`

---

## Quick Links

**By Status:**
- [View Active Requirements](#architecture-requirements)
- [View Proposed Requirements](#feature-requirements)
- [View Superseded Requirements](#documentation-requirements)

**By Category:**
- [Architecture Requirements](#architecture-requirements) (4 files)
- [Feature Requirements](#feature-requirements) (9 files)
- [Documentation Requirements](#documentation-requirements) (4 files)

---

**Maintainer:** Development Team  
**Last Updated:** 2026-03-14  
**Format:** Individual requirement files, organized by category
