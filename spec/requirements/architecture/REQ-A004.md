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

This requirement is implemented through the following work items:

### ⏳ DOC-007: Clarify Docker MFE1 Dependency Intent — PENDING

**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 0.5 hours (30 minutes)  

**Description:** Clarify in Docker documentation whether mfe1-container should be a standalone app or always linked as part of Shell composition. Current setup is ambiguous about the intent.

**Problem:**
- Dockerfile for mfe1-container exists but dependency in docker-compose isn't clear
- Unclear if mfe1 should run independently or only as part of Shell
- Documentation doesn't explain the relationship

**Solution:** Document the intended Docker setup:
- Is mfe1 standalone for testing purposes?
- Or is it only meant to run as part of compose stack?
- What's the actual use case?

**Files to Change:**
- Docker-related docs and Dockerfiles

**Acceptance Criteria:**
- [ ] Intent of mfe1-container Docker setup is clear
- [ ] Documentation matches actual deployment use case

**Related Issues:** Issue #7 from GAP_ANALYSIS.md (MEDIUM severity)

---

### ⏳ DOC-005: Clarify Docker Port Mapping Diagram — PENDING

**Priority:** 🟡 MEDIUM  
**Status:** ⏳ PENDING  
**Effort:** 0.5 hours (30 minutes)  

**Description:** Clarify Docker port mapping diagram. Current diagram is confusing about internal vs. external ports and what ports are used for what purpose.

**Problem:**
- Current diagram doesn't clearly show container internal ports (8080)
- Unclear which port is used for which application
- Confusion between development ports and Docker ports

**Solution:** Create or improve diagram showing:
- Internal ports (container view): 8080 for all
- External ports (host machine): 4200, 3000, 3002
- Purpose of each port
- How to access each app

**Files to Change:**
- Docker documentation and README diagrams

**Acceptance Criteria:**
- [ ] Diagram clearly shows internal vs. external ports
- [ ] Purpose of each port is documented
- [ ] Developer knows which URL to visit for each app

**Related Issues:** Issue #2 from GAP_ANALYSIS.md (MEDIUM severity)

**Also Related To:** [REQ-D014: Root README.md](../documentation/REQ-D014.md) — Shared documentation improvement

---

### ⏳ DOCKER-001: Create Docker Compose Configuration — PENDING (PROPOSED)

**Priority:** 🟢 LOW  
**Status:** ⏳ PENDING  
**Effort:** 4 hours (240 minutes)  

**Description:** Create docker-compose.yml for full-stack development and testing. Currently each container must be started manually or with separate commands.

**Problem:**
- Current approach: Manual startup of each container
- No orchestration layer for full system testing
- Difficult to stand up complete dev environment

**Solution:** Create docker-compose.yml configuration that:
- Defines all 3 services (Shell, MFE1, MFE2)
- Sets up port mappings correctly
- Enables health checks for all services
- Optionally runs database/backend services if needed
- Includes development-specific configurations

**Files to Create:**
- docker-compose.yml (new)
- docker-compose.override.yml (optional, for dev overrides)

**Acceptance Criteria:**
- [ ] `docker-compose up` starts all services
- [ ] All services are accessible at expected ports (4200, 3000, 3002)
- [ ] Logs are readable and useful
- [ ] Can stop and restart services cleanly

**Related Requirements:** [REQ-F012: Docker Compose Orchestration](../features/REQ-F012.md) (proposed feature)

---

## Related Requirements

- [REQ-A001: Native Federation Architecture](REQ-A001.md)
- [REQ-F012: Docker Compose Orchestration](../features/REQ-F012.md) — Future enhancement

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
