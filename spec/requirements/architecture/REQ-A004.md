# REQ-A004: Docker Deployment & Containerization

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Multi-container Docker setup with consistent port mapping and orchestration. Each MFE can run standalone or integrated within the Shell.

---

## Rationale

- Consistent development and production environments
- Easy scaling and dependency management
- Support for both local development and production deployment
- Clear port mapping for debugging and verification
- Foundation for CI/CD pipelines and automated testing

---

## Key Implementation Points

- Container internal port: 8080 (all apps)
- External ports: 4200 (Shell), 3000 (MFE1), 3002 (MFE2)
- Dockerfile per container with dev/prod configurations
- Each container can run independently or as part of stack
- Health checks implemented for deployment verification

---

## Current Status

✅ **Implemented**

All containers are properly configured and deployable:
- Shell container runs successfully on mapped port 4200
- MFE1 container runs successfully on mapped port 3000
- MFE2 container runs successfully on mapped port 3002

---

## Work Items

- [DOC-007: Clarify Docker MFE1 dependency intent](../WORK.md#DOC-007) — ⏳ Pending
- [DOCKER-001: Create docker-compose.yml](../WORK.md#DOCKER-001) — ⏳ Pending (proposed)
- [DOC-005: Clarify Docker port mapping diagram](../WORK.md#DOC-005) — ⏳ Pending

---

## Related Requirements

- [REQ-A001: Native Federation Architecture](REQ-A001.md)
- [REQ-F008: Docker Compose Orchestration](../features/REQ-F008.md) — Future enhancement

---

## Port Mapping Reference

| Application | Container Port | External Port | Purpose |
|-------------|:---------------:|:---------------:|---------|
| Shell | 8080 | 4200 | Main application, federation host |
| MFE1 | 8080 | 3000 | Angular micro frontend |
| MFE2 | 8080 | 3002 | React micro frontend |

**Note:** All containers use 8080 internally; external ports differ for local development.

---

## Deployment Considerations

**Development:**
- Each container runs independently for isolated testing
- Developers can update one MFE without restarting others
- Easy to debug with container logs

**Production:**
- Docker images built with optimized production settings
- Multi-stage builds minimize final image size
- Health checks ensure readiness before routing traffic

---

**Last Updated:** 2026-03-14  
**Owner:** DevOps / Infrastructure Team  
**Review Frequency:** When adding new services or changing port mappings
