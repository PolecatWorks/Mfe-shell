# REQ-A003: Shell Dynamic Routing System

**Status:** ACTIVE  
**Version:** 1.0  
**Proposed:** 2026-03-14  
**Supersedes:** None  
**Superseded by:** None  

---

## Description

Runtime-configured MFE loading based on shell-config.json. All remotes, routes, and menu items defined at runtime without code changes.

---

## Rationale

- Configuration-driven architecture eliminates code deployment need for route changes
- Single configuration source for all routing decisions
- Heuristic-based wrapper strategy (Angular routes vs. generic component)
- Faster iteration cycle for MFE discovery and updates
- No rebuild needed to onboard new MFEs

---

## Key Implementation Points

- Configuration file: `mfe-shell-container/public/assets/contents/shell-config.json`
- GenericMfeWrapperComponent for non-Angular frameworks
- Shell-config.json defines: remotes, routes, menu items, metadata
- Runtime heuristic determines wrapping strategy
- Supports lazy loading and progressive MFE discovery

---

## Current Status

✅ **Implemented**

The dynamic routing system is fully operational and has been handling MFE1 (Angular) and MFE2 (React) seamlessly.

---

## Work Items

No immediate work items; system is stable.

---

## Related Requirements

- [REQ-A001: Native Federation Architecture](REQ-A001.md)
- [REQ-F013: MFE Shell](../features/REQ-F013.md)
- [REQ-F013: Dynamic MFE Discovery](../features/REQ-F013.md) — Future enhancement for auto-discovery

---

## Configuration Structure

### Local Development (`mfe-shell-container/public/assets/contents/shell-config.json`)

```json
{
  "remotes": {
    "mfe1": "http://localhost:3000/remoteEntry.json",
    "mfe2": "http://localhost:3002/remoteEntry.json",
    "angry-agent": "http://localhost:3001/remoteEntry.json"
  }
}
```

### Kubernetes Deployment (`fluxcd-dev/mfe-shell.yaml`)

In Kubernetes, remote MFEs are served under `/mfe/<service>` via Istio `VirtualService` without URI path rewrites (see [REQ-A004](REQ-A004.md)):

```json
{
  "remotes": {
    "mfe1": "/mfe/mfe1/remoteEntry.json",
    "mfe2": "/mfe/mfe2/remoteEntry.json",
    "angry-agent": "/mfe/angry-agent/remoteEntry.json",
    "aad": "/mfe/aad/remoteEntry.json",
    "data-engine": "/mfe/data-engine/remoteEntry.json"
  },
  "mfeRoutes": [
    { "path": "mfe1", "displayName": "MFE 1", "remoteName": "mfe1", "exposedModule": "./routes", "componentName": "remoteRoutes" },
    { "path": "mfe2", "displayName": "Irish MFE", "remoteName": "mfe2", "exposedModule": "./Component", "componentName": "Component" },
    { "path": "angry-agent", "displayName": "Angry Agent", "remoteName": "angry-agent", "exposedModule": "./routes", "componentName": "remoteRoutes" },
    { "path": "aad", "displayName": "Agent as Data", "remoteName": "aad", "exposedModule": "./routes", "componentName": "remoteRoutes" },
    { "path": "data-engine", "displayName": "Data Engine", "remoteName": "data-engine", "exposedModule": "./routes", "componentName": "remoteRoutes" }
  ]
}
```

---

**Last Updated:** 2026-11-17  
**Owner:** Architecture Team  
**Review Frequency:** When adding new MFEs or changing routing strategy

