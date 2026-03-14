# REQ-F005: CI/CD Workflows

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

GitHub Actions workflows for automated build, test, and deployment. Includes PR workflows with conditional dependencies and main branch production workflows.

---

## Rationale

- Automated testing ensures quality before merge
- Consistent deployment process across environments
- Dependency management prevents incompatible builds
- Content-based image tagging enables efficient caching
- FluxCD integration automates production updates

---

## Key Implementation Points

- PR workflows: Shell → MFE1 → MFE2 (conditional waits)
- Main workflows: Production builds with tagged images
- Auto-deployment: FluxCD manifests updated via auto-merging PRs
- Image tagging: sha-<CONTENT_SHA> for content-specific tracking
- Parallel builds where no dependencies exist

---

## Current Status

✅ **Implemented**

CI/CD workflows are fully operational and supporting continuous delivery.

---

## Work Items

No immediate work items; CI/CD is stable.

---

## Related Requirements

- [REQ-001: Native Federation Architecture](../architecture/REQ-001.md)
- [REQ-004: Docker Deployment & Containerization](../architecture/REQ-004.md)

---

**Last Updated:** 2026-03-14  
**Owner:** DevOps Team  
**Review Frequency:** When changing deployment strategy or adding services
