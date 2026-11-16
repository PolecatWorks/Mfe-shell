# REQ-A005: Shared Canvas Protocol & Bidirectional MFE Controller

**Status:** PROPOSED  
**Version:** 1.0  
**Proposed:** 2026-11-16  
**Supersedes:** None  
**Superseded by:** None

## Description
Defines the `SharedCanvasService` in `@polecatworks/mfe-shared` and the standardized `MfeCanvasController` return contract for all federated MFE wrappers (`mfe1-container`, `data-engine`, `Angry-agent`) so that forms and visualizations mounted on the right-hand side (RHS) of a conversational UI support live, bidirectional human + AI co-editing without DOM destruction or loss of cursor focus.

## Rationale
Previously, MFE wrappers in `mfe1-container` (such as `PersonalDataFormWrapper`) only accepted initial inputs once during `mount()` and only emitted state when the user clicked "Submit". Updating form values from the AI required unmounting and remounting the component, which destroyed user focus and unsaved typing, while unsubmitted user edits were invisible to the chat LLM.

## Key Implementation Points
- Export `MfeCanvasController`, `MfeMountProps`, `JsonPatchOp`, `AiFieldAttribution`, `CanvasSelection`, and `SharedCanvasService` from `@polecatworks/mfe-shared`.
- Upgrade `mfe1-container` wrappers (`PersonalDataFormWrapper`, `DataShowWrapper`, `MermaidShowWrapper`, `JsonShowWrapper`, `MarkdownShowWrapper`, `TextShowWrapper`) to return `MfeCanvasController` instances (`applyPatch`, `getState`, `getSchema`, `unmount`).
- Support silent human edit synchronization via `onStateChange`, focus context via `onSelectionChange`, active-focus locks, and visual AI-attribution badges.
- Register `data-engine` (`/home/data-engine`) and `agent-as-data` (`/home/agent-studio`) alongside `angry-agent` in `shell-config.json` and `fluxcd-dev/virtualservice.yaml`.

## Status
⏳ Pending Implementation

## Work Items
- **ARCH-005-1**: Implement `SharedCanvasService` and controller interfaces in `mfe-shell-container/projects/mfe-shared` (Priority: 🔴 CRITICAL, Status: ⏳ PENDING).
- **ARCH-005-2**: Upgrade `PersonalDataFormWrapper` and `mfe1-container` wrappers to implement `MfeCanvasController` with in-place `applyPatch` and `getSchema` (Priority: 🟠 HIGH, Status: ⏳ PENDING).
- **ARCH-005-3**: Add `data-engine` remote routing to `shell-config.json` and `fluxcd-dev/virtualservice.yaml` (Priority: 🟡 MEDIUM, Status: ⏳ PENDING).

## Related Requirements
- [REQ-A001: Native Federation Architecture](./REQ-A001.md)
- [REQ-A002: Shared Library (mfe-shared) Singleton Pattern](./REQ-A002.md)
- [Shared Canvas Protocol & Ecosystem Federation PRD](../../prds/shared-canvas-protocol-and-ecosystem-prd.md)
