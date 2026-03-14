# Pending Work & Enhancements

This directory contains specifications for work that needs to be done: fixes, enhancements, and new features.

## Current Status

⏳ **15 Items Pending**

### Priority Breakdown
- 🔴 Critical: 1 (test runner fix)
- 🟠 High: 4 (documentation fixes)
- 🟡 Medium: 8 (improvements & features)
- 🟢 Low: 2 (nice-to-have enhancements)

## Categories

### Documentation Fixes (9 items)
**Urgency:** Immediate to Before Release

1. **DOC-001: Fix MFE1 Test Runner** (CRITICAL)
   - mfe1-container/README.md says "Karma" but should be accurate
   - Effort: 15 minutes

2. **DOC-002: Add npm link Prerequisite** (HIGH)
   - Quick Start missing critical prerequisite
   - Effort: 30 minutes

3. **DOC-003: Replace Shell README** (HIGH)
   - Generic Angular boilerplate, needs MFE context
   - Effort: 45 minutes

4. **DOC-004: Update Test Framework Docs** (HIGH)
   - Tech stack shows "Vitest" uniformly but varies by app
   - Effort: 15 minutes

5. **DOC-005: Update Docker Diagram** (HIGH)
   - Port mapping not clearly shown
   - Effort: 30 minutes

6. **DOC-006: Create Architecture Specs** (MEDIUM)
   - Formalized spec documents for architecture
   - Effort: 2-3 hours

7. **DOC-007: Clarify Docker Dependency** (MEDIUM)
   - Verify MFE1 Docker build dependency intent
   - Effort: 30 minutes

8. **DOC-008: Update Angular CLI Version** (LOW)
   - Outdated version reference
   - Effort: 5 minutes

9. **DOC-009: Update Copilot Instructions** (LOW)
   - Sync with README.md fixes
   - Effort: 30 minutes

### Feature Enhancements (3 items)
**Urgency:** Planned/Future

1. **FEAT-001: E2E Testing Framework** (MEDIUM)
   - Playwright-based integration tests
   - Effort: 12-20 hours

2. **FEAT-002: MFE2 Shared Library** (MEDIUM)
   - Integrate shared state with React MFE
   - Effort: 8-16 hours

3. **FEAT-003: MFE Registry/Discovery** (LOW)
   - Auto-discovery without shell-config.json
   - Effort: 16-24 hours

### Architecture Work (1 item)
**Urgency:** Before Feature Work

1. **ARCH-001: Document Federation Config** (MEDIUM)
   - Detailed federation configuration docs
   - Effort: 1-2 hours

### Infrastructure (1 item)
**Urgency:** Helpful for Development

1. **DOCKER-001: Docker Compose** (LOW)
   - Simplified full-stack startup
   - Effort: 4-6 hours

### Testing (1 item)
**Urgency:** Critical for Quality

1. **TEST-001: E2E Test Suite** (MEDIUM)
   - Comprehensive integration testing
   - Effort: 12-20 hours

## Getting Started

### This Week (ASAP)
Start with these CRITICAL/HIGH items (65-75 minutes total):
1. DOC-001 - Test runner fix
2. DOC-002 - npm link prerequisite
3. DOC-004 - Test framework docs
4. DOC-005 - Docker diagram

### Before Release
Complete these before shipping:
1. DOC-003 - Shell README replacement
2. DOC-006 - Architecture specs
3. DOC-007 - Docker dependency clarification

### Future Sprints
Plan these for roadmap:
1. FEAT-001 - E2E testing
2. FEAT-002 - Shared library for React
3. ARCH-001 - Federation config docs
4. DOCKER-001 - Docker Compose

## How to Use

1. **To see what needs to be done:**
   - Check [WORK_ITEMS.md](../WORK_ITEMS.md) for detailed tracking

2. **To understand priority:**
   - Review priority and effort estimates in [WORK_ITEMS.md](../WORK_ITEMS.md)
   - Check dependencies (some items wait for others)

3. **To pick next task:**
   - Sort by Priority: Critical → High → Medium → Low
   - Sort by Effort: Shortest first for quick wins
   - Or pick by category: Documentation → Architecture → Features

4. **To track progress:**
   - Update status in [WORK_ITEMS.md](../WORK_ITEMS.md)
   - Move files to `implemented/` directory when done

## Related

- [WORK_ITEMS.md](../WORK_ITEMS.md) - Detailed work tracking
- [SPECIFICATIONS.md](../SPECIFICATIONS.md) - Master spec index
- [DOCUMENTATION_ANALYSIS.md](../DOCUMENTATION_ANALYSIS.md) - Analysis of issues
- [../implemented/README.md](../implemented/README.md) - What's done

## Statistics

| Metric | Value |
|--------|-------|
| Total Items | 15 |
| Total Effort | ~80-100 hours |
| Critical Path | ~2 hours |
| Quick Wins (< 30min) | 5 items |
| Medium Tasks (0.5-3hr) | 6 items |
| Large Features (> 8hr) | 4 items |
