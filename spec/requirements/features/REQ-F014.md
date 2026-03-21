# REQ-F014: OpenTelemetry Observability

**Status:** ACTIVE
**Version:** 1.0
**Date:** 2026-03-21
**Supersedes:** None
**Superseded by:** None

---

## Description

Implement centralized observability across MFE Shell and remotes using OpenTelemetry for logging, tracing, and metrics.

---

## Rationale

- Distributed system makes troubleshooting difficult without centralized logging
- Monitoring MFE health and performance is critical for user experience
- Future: Integration with backend traces for full-stack visibility
- Standardizes observability patterns across independent MFE containers

---

## Key Implementation Points

- **Shared Service:** `SharedOtelService` in `mfe-shared` provides a unified API for logging
- **Collector:** Logs are exported to a configurable OTLP HTTP collector
- **Contextual Logging:** Automatically includes user context (username, roles) in log attributes
- **Level Filtering:** Configurable log level filtering at runtime

---

## Current Status

✅ **Active**

The core infrastructure for OpenTelemetry logging is implemented in `mfe-shared` and ready for use in Shell and MFE remotes.

---

## Work Items

### ✅ FEAT-014: Implement OpenTelemetry Logging Service — COMPLETED

**Priority:** 🔴 HIGH
**Status:** ✅ COMPLETED
**Effort:** 8-12 hours

**Description:** Created `SharedOtelService` in `mfe-shared` library to provide a standardized logging interface for all MFEs.

**Acceptance Criteria:**
- [x] Unified logging API in `mfe-shared`
- [x] Integration with `@opentelemetry/sdk-logs`
- [x] OTLP HTTP exporter implementation
- [x] Contextual information (user) included in logs
- [x] Runtime configuration support via `OTelConfig`

**Deliverables:**
- `SharedOtelService` implementation
- `@opentelemetry` dependencies added to `mfe-shared`, Shell, and MFE1
- Updated build pipelines to support OpenTelemetry resolution
- Initial configuration in Shell application

---

## Related Requirements

- [REQ-A002: Shared Library Singleton Pattern](../architecture/REQ-A002.md)
- [REQ-F001: MFE Shell](REQ-F001.md)

---

**Last Updated:** 2026-03-21
**Owner:** Architecture Team
**Review Frequency:** Quarterly
