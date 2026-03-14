# Specifications & Requirements

This directory contains all specifications, requirements, and work tracking for the MFE Shell project using an **RFC-inspired approach**. Each requirement has a clear status (Active, Proposed, Superseded) and version history, allowing visibility into how requirements evolve over time.

The system serves as the single source of truth for:
- **Requirements** - What must be built (with specs and work items) — in `requirements/` directory
- **Implementation Results** - What was done, changes made, and UAT status — embedded in requirement files
- **Work Items** - Tasks to implement requirements — now part of each requirement file

## RFC-Inspired Approach

Similar to IETF RFCs, requirements capture the specification and are versioned. When requirements change or are superseded, the history is preserved:

- **ACTIVE**: Currently implemented or under development
- **PROPOSED**: Planned for future implementation
- **SUPERSEDED**: Replaced by a newer requirement (old version kept for auditability)

This enables:
- ✅ Full visibility into how designs evolved
- ✅ Understanding why past decisions were made
- ✅ Tracing impact of requirement changes
- ✅ Easy rollback or revert decisions if needed

## Directory Structure

```
spec/
├── README.md                          # This file - Navigation and guidance
├── ARCHITECTURE.md                    # System architecture overview with Mermaid diagrams
├── DOCUMENTATION_ANALYSIS.md          # Issue tracking (9 discrepancies identified)
├── requirements/                      # RFC-like requirements directory (SINGLE SOURCE)
│   ├── README.md                      # Requirements index (overview of all 17)
│   ├── architecture/                  # Architecture requirements (4 files)
│   │   ├── REQ-A001.md                # Native Federation Architecture
│   │   ├── REQ-A002.md                # Shared Library Singleton Pattern
│   │   ├── REQ-A003.md                # Shell Dynamic Routing System
│   │   └── REQ-A004.md                # Docker Deployment & Containerization
│   ├── features/                      # Feature requirements (9 files)
│   │   ├── REQ-F005.md through F013   # All features (implemented + proposed)
│   └── documentation/                 # Documentation requirements (4 files)
│       ├── REQ-D014.md through D017   # Root README, Container READMEs, Copilot, Architecture
```

**Consolidated Structure:**
- Each requirement file (REQ-###.md) now includes:
  - Description & Rationale (always)
  - Key Implementation Points (always)
  - Current Status (always)
  - **Implementation Results** (if completed)
  - **Work Items** (with priority, status, effort, details)
  - Related Requirements (cross-links)

## Quick Navigation

### 👉 Start Here
- **Understanding the Architecture?** → Read `ARCHITECTURE.md` (system overview with diagrams)
- **Understanding Requirements?** → Read `requirements/README.md` (index of all 17 requirements)
- **Finding a specific requirement?** → Check `requirements/README.md` index table, then open the specific file
- **Checking Work Status?** → Open any requirement file and scroll to "Work Items" section
- **Seeing implementation results?** → Open the requirement file (e.g., `requirements/documentation/REQ-D015.md`) → scroll to "Implementation Results" or "Work Items"

### By Question
| Question | Answer |
|----------|--------|
| What are the 17 requirements? | `requirements/README.md` - Index with links to all files |
| Where is requirement REQ-D015? | `requirements/documentation/REQ-D015.md` - Container READMEs |
| What's the current work status? | Any requirement file → "Work Items" section: 1 ✅ done, 14 ⏳ pending |
| Which requirement maps to which work item? | Requirement file → "Work Items" section shows all linked tasks |
| How do I know if a requirement was superseded? | `requirements/[category]/REQ-###.md` - Shows "Superseded by: X" |
| What changed in mfe1-container/README.md? | `requirements/documentation/REQ-D015.md` - "Implementation Results" section |
| What are the work items for a requirement? | Open the requirement file → "Work Items" section → all tasks listed |

---

## Core Concepts

### Requirements (requirements/ directory)
Single source of truth, split into individual files:
- **17 total requirements:** 12 Active, 5 Proposed
- **Organized by category:** architecture/ (4), features/ (9), documentation/ (4)
- **Each has:** Status, Version, Proposed date, Description, Rationale, Implementation points
- **Versioned:** Each requirement can evolve with version numbers and supersession tracking
- **Index:** `requirements/README.md` lists all with quick links

### Work Items (In Requirement Files)
Tasks to implement requirements are now embedded in each requirement file:
- **15 total items:** 1 ✅ done, 14 ⏳ pending
- **Located in:** "Work Items" section of each requirement file
- **Includes:** Priority, Status, Effort, Acceptance Criteria, Files to Change, Dependencies
- **Example:** `requirements/documentation/REQ-D015.md` → "Work Items" section shows DOC-001, DOC-003, DOC-008

---

## How Supersession Works

When a requirement evolves or changes:

1. **Create new version** (e.g., REQ-A001-v2.md or update existing file)
2. **Mark old version as superseded** in header
3. **Preserve old file** for historical reference
4. **Update work items** to reference new requirement

**Example in a requirement file:**
```markdown
### REQ-A001: Native Federation Architecture (ACTIVE)
**Version:** 2.0 (UPDATED 2026-04-15)
**Supersedes:** REQ-A001 v1.0
**Superseded by:** None

Changes in v2.0:
- Added lazy-loaded remote support
- Enhanced configuration validation

---

## Superseded

### REQ-A001-v1: Native Federation Architecture (SUPERSEDED)
**Version:** 1.0
**Proposed:** 2026-03-14
**Superseded:** 2026-04-15
**Reason:** v2.0 adds lazy-loaded remote support

Old approach: [description]
See: REQ-A001 v2.0 for current approach
```

---

## Status Summary

| Component | Count | Location |
|-----------|-------|----------|
| **Active Requirements** | 12 | `requirements/` with indexes per category |
| **Proposed Requirements** | 5 | `requirements/` marked as PROPOSED |
| **Work Items** | 15 | Embedded in requirement files (1 ✅ done, 14 ⏳ pending) |
| **Implementation Results** | 1 | `requirements/documentation/REQ-D015.md` (DOC-001) |
| **Blocked Work** | 1 | `requirements/documentation/REQ-D016.md#DOC-009` (waiting on DOC-002-005) |

---

## Adding New Requirements

1. **Pick category:** architecture/, features/, or documentation/
2. **Create file:** `requirements/[category]/REQ-###.md`
3. **Use template** (see any REQ file for format)
4. **Update index:** Add to `requirements/README.md` table
5. **Link work items:** Add "Work Items" section with all needed tasks

---

## Adding New Work Items

1. **Find requirement:** Locate related REQ-### in requirements/
2. **Open requirement file:** Edit `requirements/[category]/REQ-###.md`
3. **Add to Work Items section:** Include:
   - Work item ID (e.g., DOC-002)
   - Title and description
   - Priority, Status, Effort estimate
   - Problem statement and proposed solution
   - Acceptance criteria
   - Files to change/create
   - Related issues and dependencies

---

## Implementing a Work Item

When you complete a work item:

1. **Update requirement file:** In the same REQ-### file, add "Implementation Results" section:
   - What was changed (files modified)
   - Changes made (detailed list)
   - UAT test results (pass/fail status)
   - Verification checklist
   - Completion date

2. **Update Work Items section:** Mark as ✅ COMPLETE

3. **No separate files needed:** Everything lives in the requirement file

---

## File Organization Benefits

✅ **Single Source per Type**
- Each requirement in its own file (not scattered)
- Each work item in WORK.md (central tracking)
- Clear, organized hierarchy

✅ **Easier Maintenance**
- Update one requirement without touching others
- Reduced merge conflicts (each team member works on different files)
- Version control shows exactly what changed

✅ **Better Navigation**
- `requirements/README.md` provides overview and links
- Direct access to any requirement
- Category organization reduces cognitive load

✅ **RFC-Style Auditability**
- Old versions preserved (renamed or archived)
- Full history of changes visible
- Understand why decisions evolved

---

## Navigation Tips

**To find a requirement:**
1. Check `requirements/README.md` for index
2. Click link to specific REQ file in appropriate category
3. Each file has "Related Requirements" section for exploration

**To understand what work is needed:**
1. Open specific requirement file (e.g., `requirements/documentation/REQ-D015.md`)
2. Scroll to "Work Items" section
3. See all tasks: status (done/pending), priority, effort, acceptance criteria

**To trace a work item to its requirement:**
1. Go directly to the requirement file (work items are embedded there)
2. Example: DOC-003 → Open `requirements/documentation/REQ-D015.md` → "Work Items" section
3. See full context: spec, problem, solution, implementation

**To see implementation results:**
1. Open requirement file (e.g., `requirements/documentation/REQ-D015.md`)
2. Scroll to "Implementation Results" section
3. See what changed, UAT results, verification checklist

---

## Legacy Files (for reference)

These files from the transition are no longer used:
- `SPECIFICATIONS.md` → Content merged into `requirements/`
- `WORK.md` → Content merged into requirement files ✅ Deleted
- `WORK_ITEMS.md` → Content merged into requirement files ✅ Deleted
- `tasks/` directory → All content merged into requirement files ✅ Deleted
- `architecture/`, `implemented/`, `pending/` directories → Consolidated into requirements/ ✅ Deleted

---

## Questions?

- **What needs to be built?** → `requirements/README.md` (find your requirement)
- **What work should I do?** → Open any requirement file → "Work Items" section
- **How do I see implementation results?** → Open requirement file → "Implementation Results" section
- **How is this system organized?** → This file (you are here!)

---

**Last Updated:** 2026-03-14  
**Maintainer:** Development Team  
**Format:** RFC-inspired with individual requirement files, organized by category
