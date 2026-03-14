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

```json
{
  "remotes": [
    {
      "name": "mfe1",
      "port": 3000,
      "url": "http://localhost:3000/remoteEntry.json"
    },
    {
      "name": "mfe2",
      "port": 3002,
      "url": "http://localhost:3002/remoteEntry.json"
    }
  ],
  "routes": [
    {
      "path": "mfe1",
      "remote": "mfe1",
      "label": "MFE1"
    },
    {
      "path": "mfe2",
      "remote": "mfe2",
      "label": "MFE2"
    }
  ]
}
```

---

**Last Updated:** 2026-03-14  
**Owner:** Architecture Team  
**Review Frequency:** When adding new MFEs or changing routing strategy
