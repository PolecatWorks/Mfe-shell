# REQ-A006: Build Once, Promote Everywhere & Container Verification Architecture

**Status:** PROPOSED  
**Version:** 1.0  
**Proposed:** 2026-11-20  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Architectural specification for container artifact immutability, content-hash registry caching, container smoke testing, and automated Robot Framework verification across MFE Shell and Micro-Frontend remotes.

---

## Rationale

- Eliminates redundant image compilation between pull requests and main releases.
- Guarantees byte-level artifact immutability from staging/PR validation to production.
- Prevents broken container configurations or corrupted Nginx templates from reaching registries.
- Establishes automated integration test gates via Robot Framework for route prefixes and CORS policies.

---

## Key Architectural Principles

### 1. Content-SHA Addressing
Every container image build must be keyed to the git tree hash of its component source files and relevant workflow definitions:
```bash
CONTENT_SHA=$(git log -1 --format=%H -- <component-folder>/ .github/workflows/<workflow>.yml)
```

### 2. Registry Pre-Flight (`check-image`)
Before invoking `docker buildx build`, the workflow queries the container registry (`ghcr.io`) for `sha-${CONTENT_SHA}`. If present, the build matrix is bypassed and the workflow advances directly to manifest tagging and promotion.

### 3. Container Smoke Verification
Each platform build must execute local ephemeral container verification:
- Validate that the process daemon (Nginx) initializes cleanly without template errors.
- Confirm HTTP 200 response on `/index.html` and root static assets.
- Validate preflight CORS headers on federation remote endpoints.

### 4. Promotion via Manifest Retagging
Promotion between environments (PR -> Main -> Semantic Release) must be achieved through OCI manifest retagging (`docker buildx imagetools create`) referencing the immutable digest, never by rebuilding from source.

### 5. Automated Robot Integration Testing
Integration test suites in `integration-tests/tests/*.robot` must be executed within GitHub Actions against orchestrated containers before merging PRs.

---

## Related Requirements & PRDs
- [PRD: CI/CD Pipeline Modernization](../../prds/ci-cd-pipeline-improvements-prd.md)
- [REQ-A004: Docker Deployment & Containerization](REQ-A004.md)
- [REQ-F009: CI/CD Workflows](../features/REQ-F009.md)
