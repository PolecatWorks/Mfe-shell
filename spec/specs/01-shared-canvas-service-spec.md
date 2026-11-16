# Spec 01: `SharedCanvasService` & `MfeCanvasController` in `@polecatworks/mfe-shared`

- **Status**: `complete`
- **Derived From**: [shared-canvas-protocol-and-ecosystem-prd.md](../prds/shared-canvas-protocol-and-ecosystem-prd.md), [REQ-A005](../requirements/architecture/REQ-A005.md)
- **Target Package**: `@polecatworks/mfe-shared` (`mfe-shell-container/projects/mfe-shared`)

---

## 1. Objective
Provide the canonical, framework-agnostic `MfeCanvasController` interface and `SharedCanvasService` singleton in `@polecatworks/mfe-shared` so that any MFE form or visualization mounted on the right-hand side (RHS) of a conversational host (`Angry-agent`) supports live bidirectional human + AI co-editing without losing DOM focus or unsaved input.

---

## 2. Architecture & Data Flow

```mermaid
flowchart LR
    Host["Host (Angry-agent / Mfe-shell)"] -->|registerController(id, ctrl)| SCS["SharedCanvasService"]
    Host -->|applyPatches(id, patches, attributions)| SCS
    SCS -->|ctrl.applyPatch(filteredPatches, attributions)| MFE["Mounted MFE Controller"]
    MFE -->|notifyStateChange(id, state, patches)| SCS
    MFE -->|setActiveSelection(selection)| SCS
    SCS -->|canvasState$ / activeSelection$| Host
```

---

## 3. Payload Contracts & Interfaces

File: `mfe-shell-container/projects/mfe-shared/src/lib/shared-canvas.service.ts` (exported via `src/public-api.ts`)

```typescript
export interface JsonPatchOp {
  op: 'add' | 'replace' | 'remove';
  path: string;
  value?: any;
}

export interface AiFieldAttribution {
  path: string;
  source: 'ai' | 'user';
  confidence?: number;
  rationale?: string;
  epistemicStatus?: 'hypothesized' | 'empirically_tested' | 'verified' | 'rejected';
}

export interface CanvasSelection {
  canvasId: string;
  path: string;
  id?: string;
  label: string;
  context?: any;
}

export interface MfeMountProps<T = any> {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  content?: T;
  initialState?: T;
  onStateChange?: (state: T, patches: JsonPatchOp[]) => void;
  onSelectionChange?: (selection: CanvasSelection | null) => void;
  onAction?: (actionName: string, payload: any) => void;
}

export interface MfeCanvasController<T = any> {
  applyPatch(patches: JsonPatchOp[] | Partial<T>, attributions?: AiFieldAttribution[]): void;
  getState(): T;
  getSchema(): Record<string, any>;
  unmount(): void;
}
```

### Pure Helper Functions & Service Methods
1. `applyJsonPatches<T>(target: T, patches: JsonPatchOp[] | Partial<T>): T`:
   - Clones `target` and applies either an array of RFC 6902 `JsonPatchOp` (`add`, `replace`, `remove` using `/` JSON Pointers) or a partial object merge cleanly.
2. `computeJsonPatches(prev: Record<string, any>, next: Record<string, any>): JsonPatchOp[]`:
   - Computes fine-grained `replace`/`add`/`remove` operations between two flat or nested state objects.
3. `SharedCanvasService`:
   - `registerController(canvasId: string, controller: MfeCanvasController)`: Registers a live mounted controller and emits its initial state & schema.
   - `unregisterController(canvasId: string)`: Removes a controller on unmount and clears `activeSelection$` if it belonged to `canvasId`.
   - `setFocusedPath(canvasId: string, path: string | null)`: Records which JSON Pointer path currently holds keyboard focus in `canvasId`.
   - `applyPatchToCanvas(canvasId: string, patches: JsonPatchOp[] | Record<string, any>, attributions?: AiFieldAttribution[])`:
     - Filters out or defers patches that collide with the currently focused path (`focusedPaths.get(canvasId)`) to prevent mid-keystroke cursor jumping, then delegates to `controller.applyPatch(...)`.
   - `recordStateChange(canvasId: string, state: any, patches: JsonPatchOp[])`: Updates the live state snapshot and emits on `canvasState$`.
   - `setActiveSelection(selection: CanvasSelection | null)`: Updates `activeSelection$` for "Point-and-Ask" context.
   - `getCanvasContextSnapshot(canvasId?: string)`: Returns `{ canvasId, state, schema, activeSelection, attributions }` for attachment to `POST /api/chat`.

---

## 4. TDD Test Strategy

### Unit Tests (`mfe-shell-container/projects/mfe-shared/src/lib/shared-canvas.service.spec.ts`)
1. **RFC 6902 Patch Application (`applyJsonPatches`)**:
   - Applies `replace`, `add`, and `remove` operations on top-level and nested JSON Pointer paths (e.g., `/firstName`, `/fields/0/unit`).
   - Supports partial object fallback when a plain object is provided instead of `JsonPatchOp[]`.
2. **Diff Generation (`computeJsonPatches`)**:
   - Generates accurate `replace` and `add` patch operations when user edits form fields.
3. **Controller Registration & Lifecycle**:
   - Registers a mock `MfeCanvasController`, retrieves live state and schema via `getCanvasContextSnapshot()`, and cleans up on `unregisterController()`.
4. **Active-Focus Lock Protection**:
   - When `setFocusedPath('viz-1', '/email')` is active and an AI patch array attempts to modify `/email` and `/firstName`, `/firstName` is applied immediately while `/email` is deferred until `setFocusedPath('viz-1', null)` is called on blur.
5. **Point-and-Ask Selection Stream (`activeSelection$`)**:
   - Emits `CanvasSelection` changes and clears selection when the owning canvas is unregistered.
