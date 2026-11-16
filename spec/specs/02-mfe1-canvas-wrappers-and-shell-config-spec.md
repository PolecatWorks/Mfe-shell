# Spec 02: `mfe1-container` Shared Canvas Wrappers & `shell-config.json` Ecosystem Registration

- **Status**: `complete`
- **Derived From**: [shared-canvas-protocol-and-ecosystem-prd.md](../prds/shared-canvas-protocol-and-ecosystem-prd.md), [mfe1-container PRD](../../mfe1-container/spec/PRD.md)
- **Target Packages**: `mfe1-container`, `mfe-shell-container`

---

## 1. Objective
Upgrade `PersonalDataForm` and all MFE wrappers in `mfe1-container` (`PersonalDataFormWrapper`, `DataShowWrapper`, `JsonShowWrapper`, `MermaidShowWrapper`, `MarkdownShowWrapper`, `PieChartShowWrapper`, `TextShowWrapper`) so `mount(container, props)` returns a backward-compatible callable `MfeCanvasController` supporting live in-place patching (`applyPatch`), live state inspection (`getState`), self-describing JSON Schema (`getSchema`), silent state change notifications (`onStateChange`), and "Point-and-Ask" field focus context (`onSelectionChange`).

---

## 2. Component & Wrapper Requirements

### 2.1 `PersonalDataForm` (`mfe1-container/src/app/personal-data-form/personal-data-form.ts`)
1. **Live In-Place Patch Method (`applyPatch`)**:
   - Accepts either RFC 6902 `JsonPatchOp[]` (e.g., `[{ op: 'replace', path: '/firstName', value: 'Alice' }]`) or a partial data object (supporting both `camelCase` and `snake_case` keys like `first_name` / `firstName`).
   - Updates `this.form` via `patchValue(..., { emitEvent: false })` without resetting untouched fields or losing focus on the currently active input element (`focusedField`).
   - If a patch targets the currently focused field (`this.focusedField`), stores it in `pendingPatches` and applies it automatically when that field blurs (`onFieldBlur`).
2. **AI Field Attribution Badges (`aiAttributions`)**:
   - Stores `AiFieldAttribution` metadata per field (`source === 'ai'`, `confidence`, `rationale`) and renders an `"AI updated"` badge/indicator on patched fields in `personal-data-form.html`; clears the AI badge when the human user manually edits that field.
3. **Silent State Change Emission (`stateChange` Output)**:
   - Subscribes to `this.form.valueChanges` and emits `{ state, patches }` whenever the human user edits a control.
4. **"Point-and-Ask" Focus Tracking (`selectionChange` Output)**:
   - When the user focuses an input (`onFieldFocus(fieldName, label)`), emits `CanvasSelection` (`{ canvasId, path: '/' + fieldName, label, context: { currentValue } }`).
5. **Self-Describing Schema (`getSchema()`)**:
   - Returns the Draft-07 JSON Schema describing `firstName`, `lastName`, `email`, `phoneNumber`, `address`, and supported actions (`submit`, `cancel`).

### 2.2 Backward-Compatible Callable `MfeCanvasController` in Wrappers
All `mount(container, props)` functions in `mfe1-container` return:
```typescript
const cleanup = () => unmount(container);
return Object.assign(cleanup, {
  applyPatch: (patches: any, attributions?: any[]) => { ... },
  getState: () => { ... },
  getSchema: () => ({ ... }),
  unmount: cleanup,
});
```
This guarantees 100% compatibility with legacy callers expecting `const unmountFn = await mount(...); unmountFn();` as well as `MfeCanvasController` hosts calling `controller.applyPatch(...)`, `controller.getState()`, `controller.getSchema()`, and `controller.unmount()`.

### 2.3 Ecosystem Registration (`shell-config.json`)
Register `data-engine` (`http://localhost:4203/remoteEntry.json`) in `mfe-shell-container/public/assets/contents/shell-config.json` alongside `mfe1`, `mfe2`, and `angry-agent`.

---

## 3. TDD Test Strategy

### Unit Tests (`mfe1-container/src/app/personal-data-form/personal-data-form.spec.ts`)
1. **In-Place `applyPatch` with RFC 6902 JSON Patch & Partial Objects**:
   - Verifies that `applyPatch([{ op: 'replace', path: '/firstName', value: 'Grace' }, { op: 'replace', path: '/email', value: 'grace@navy.mil' }])` updates the reactive form in place without resetting other fields.
2. **Active-Focus Lock Preservation**:
   - Verifies that when `onFieldFocus('email', 'Email Address')` is active, an incoming AI patch to `/email` does not overwrite the active control mid-keystroke until `onFieldBlur('email')` is triggered.
3. **AI Field Attribution Lifecycle**:
   - Verifies that `applyPatch` records AI attribution for patched fields and that manual user editing clears the AI attribution for the edited field.
4. **`stateChange`, `selectionChange`, and `getSchema()`**:
   - Verifies that user edits emit `stateChange` with RFC 6902 diff patches, field focus emits `selectionChange`, and `getSchema()` returns a valid Draft-07 JSON Schema.
