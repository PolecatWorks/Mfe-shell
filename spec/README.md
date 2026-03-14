# Specifications & Requirements

This directory contains all specifications, requirements, and work tracking for the MFE Shell project using an **RFC-inspired approach**. Each requirement has a clear status (Active, Proposed, Superseded) and version history, allowing visibility into how requirements evolve over time.

The system serves as the single source of truth for:
- **Requirements** - What must be built (with supersession tracking)
- **Work Items** - Tasks to implement requirements (linked to requirements)
- **Task Documentation** - UAT steps and implementation guidance for each task

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
├── REQUIREMENTS.md                    # RFC-like requirements (SINGLE SOURCE OF TRUTH)
│                                      # All 12 active + any superseded requirements
├── WORK.md                            # Active work items (linked to REQUIREMENTS.md)
│                                      # 15 items: 1 done, 14 pending
│
└── tasks/                             # Task implementations and UAT
    ├── README.md                      # Index of all tasks
    ├── DOC-001.md                     # ✅ Complete - MFE1 test runner docs
    ├── DOC-002.md                     # 📋 Template for new tasks
    └── [TASK-ID].md                   # One file per task (UAT focused)
```

## Quick Navigation

### 👉 Start Here
- **Understanding Requirements?** → Read `REQUIREMENTS.md` (full specs with version control)
- **Checking Work Status?** → Read `WORK.md` (all tasks linked to requirements)
- **Implementing a Task?** → Read `tasks/[TASK-ID].md` (UAT steps and testing)

### By Question
| Question | Answer |
|----------|--------|
| What are the 12 active requirements? | `REQUIREMENTS.md` - Architecture, Features, Documentation |
| What's the current work status? | `WORK.md` - 1 ✅ done, 0 🔄 in progress, 14 ⏳ pending |
| Which requirement maps to which work item? | `WORK.md` - Each task shows Requirement: REQ-### |
| How do I know if a requirement was superseded? | `REQUIREMENTS.md` - Shows "Superseded by: X" and has a Superseded section |
| How do I test a completed task? | `tasks/[TASK-ID].md` - UAT steps and checklists |
| What changed in mfe1-container/README.md? | `tasks/DOC-001.md` - What Was Changed section |

---

## Core Concepts

### Requirements (REQUIREMENTS.md)
Single source of truth for all specifications:
- 12 Active requirements (Architecture, Features, Documentation)
- 5 Proposed future enhancements
- Version numbers and supersession tracking
- Each has: Status, Version, Proposed date, Description, Rationale, Implementation points

### Work Items (WORK.md)
Active tasks to implement requirements:
- 15 total items: 1 ✅ done, 14 ⏳ pending
- Each linked to specific requirement(s) from REQUIREMENTS.md
- Includes: Priority, Effort, Acceptance Criteria, Files to Change
- Tracks dependencies (e.g., DOC-009 blocked by DOC-001-005)

### Tasks (tasks/[ID].md)
Implementation details and UAT for each work item:
- NOT duplicates of WORK.md (they reference it)
- Focus: What changed, UAT steps, test checklist
- One file per completed or in-progress task
- Example: tasks/DOC-001.md - What was changed + 8 UAT scenarios

---

## Supersession & Version Control

When a requirement changes, create a new version:

**Example (future):**
```markdown
### REQ-001: Native Federation Architecture (ACTIVE)
**Version:** 2.0 (UPDATED 2026-04-15)
**Supersedes:** REQ-001 v1.0
**Superseded by:** None

Changes in v2.0:
- Added support for lazy-loaded remotes
- Enhanced configuration validation

---

## Superseded

### REQ-001-v1: Native Federation Architecture (SUPERSEDED)
**Version:** 1.0
**Proposed:** 2026-03-14
**Superseded:** 2026-04-15
**Reason:** v2.0 adds support for lazy-loaded remotes

Old approach: [description]
See: REQ-001 v2.0 for current approach
```

---

## Status Summary

| Component | Count | Details |
|-----------|-------|---------|
| **Requirements** | 12 Active + 5 Proposed | See REQUIREMENTS.md |
| **Work Items** | 15 total | 1 ✅ Done, 14 ⏳ Pending |
| **Tasks** | 1 ✅ complete | DOC-001 (MFE1 test runner docs) |
| **Blocked Work** | 1 | DOC-009 (waiting on DOC-001-005) |

---

## Adding a New Requirement

1. **Add to REQUIREMENTS.md** with template:
   ```markdown
   ### REQ-###: [Name]
   **Status:** ACTIVE|PROPOSED  
   **Version:** 1.0  
   **Proposed:** YYYY-MM-DD  
   **Supersedes:** None  
   **Superseded by:** None
   
   **Description:** [What it is]
   **Rationale:** [Why it matters]
   **Status:** ✅ Implemented | ⏳ Pending | 🔄 In Progress
   ```

2. **Add to WORK.md** if work is needed:
   ```markdown
   ### [TASK-ID]: [Name]
   **Requirement:** REQ-###
   **Status:** ⏳ PENDING
   **Effort:** X hours
   ```

3. **Create tasks/[ID].md** when work begins

---

## Adding a New Work Item

1. **Create entry in WORK.md** with:
   - Requirement reference: `REQ-###`
   - Priority, Status, Effort
   - Problem, Solution, Acceptance Criteria
   - Related Issues

2. **Create tasks/[ID].md** with:
   - Reference back to WORK.md
   - What Was Changed section
   - UAT steps and checklists

---

## Tracking Completed Work

When you complete a work item:

1. **Update WORK.md**: Change Status to ✅ DONE, add completion date
2. **Update REQUIREMENTS.md**: If requirement status changed, update it there
3. **Create/update tasks/[ID].md**: Document UAT results
4. **Run UAT**: Use checklist in tasks/[ID].md to verify completeness

Example: DOC-001 is ✅ DONE and tracked in both WORK.md and tasks/DOC-001.md

---

## Legacy Files (for reference)

These files are retained for historical reference but information is now consolidated:
- `SPECIFICATIONS.md` → Merged into `REQUIREMENTS.md`
- `WORK_ITEMS.md` → Merged into `WORK.md`
- `DOCUMENTATION_ANALYSIS.md` → Issues now in WORK.md
- `architecture/`, `implemented/`, `pending/` directories → Not needed with new structure

To enable a full transition, these will be archived or removed in next phase.

---

## Questions?

- **What are we building?** → `REQUIREMENTS.md` (active requirements)
- **What are we working on?** → `WORK.md` (current tasks)
- **How do I test DOC-001?** → `tasks/DOC-001.md` (UAT guide)
- **Why did we supersede REQ-X?** → `REQUIREMENTS.md` (history section)
- **How do requirements work here?** → This file (you are here!)

---

**Last Updated:** 2026-03-14  
**Maintainer:** Development Team  
**Format:** RFC-inspired with version control and supersession tracking

