import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

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
  /** Apply RFC 6902 JSON Patch array or partial object in-place without destroying DOM */
  applyPatch(patches: JsonPatchOp[] | Partial<T>, attributions?: AiFieldAttribution[]): void;
  /** Retrieve live unsubmitted state from the mounted component */
  getState(): T;
  /** Retrieve Draft-07 JSON Schema of the component's state and supported actions */
  getSchema(): Record<string, any>;
  /** Destroy the mounted component and release resources */
  unmount(): void;
}

export interface CanvasStateEvent<T = any> {
  canvasId: string;
  source: 'user' | 'ai';
  state: T;
  patches: JsonPatchOp[];
  attributions?: AiFieldAttribution[];
}

export interface CanvasContextSnapshot<T = any> {
  canvasId: string;
  state: T;
  schema: Record<string, any>;
  activeSelection: CanvasSelection | null;
  attributions: AiFieldAttribution[];
}

/**
 * Pure RFC 6902 JSON Pointer patch applicator.
 * Supports both an array of JsonPatchOp ({ op, path, value }) and partial object merges.
 */
export function applyJsonPatches<T = any>(target: T, patches: JsonPatchOp[] | Partial<T>): T {
  if (target === null || target === undefined || typeof target !== 'object') {
    if (!Array.isArray(patches)) {
      return patches as T;
    }
    return target;
  }

  const clone: any = JSON.parse(JSON.stringify(target));

  if (!Array.isArray(patches)) {
    if (patches && typeof patches === 'object') {
      return { ...clone, ...patches };
    }
    return clone;
  }

  for (const patch of patches) {
    if (!patch || typeof patch.path !== 'string') {
      continue;
    }
    const rawTokens = patch.path
      .split('/')
      .slice(1)
      .map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~'));

    if (rawTokens.length === 0) {
      continue;
    }

    let cursor: any = clone;
    for (let i = 0; i < rawTokens.length - 1; i++) {
      const token = rawTokens[i];
      const nextToken = rawTokens[i + 1];
      if (Array.isArray(cursor)) {
        const idx = Number(token);
        if (cursor[idx] === undefined || cursor[idx] === null) {
          cursor[idx] = /^\d+$/.test(nextToken) ? [] : {};
        }
        cursor = cursor[idx];
      } else {
        if (cursor[token] === undefined || cursor[token] === null) {
          cursor[token] = /^\d+$/.test(nextToken) ? [] : {};
        }
        cursor = cursor[token];
      }
    }

    const leaf = rawTokens[rawTokens.length - 1];
    if (patch.op === 'remove') {
      if (Array.isArray(cursor)) {
        const idx = Number(leaf);
        if (!Number.isNaN(idx)) {
          cursor.splice(idx, 1);
        }
      } else if (cursor && typeof cursor === 'object') {
        delete cursor[leaf];
      }
    } else if (patch.op === 'add' || patch.op === 'replace') {
      if (Array.isArray(cursor)) {
        if (leaf === '-') {
          cursor.push(patch.value);
        } else {
          const idx = Number(leaf);
          if (!Number.isNaN(idx)) {
            cursor[idx] = patch.value;
          }
        }
      } else if (cursor && typeof cursor === 'object') {
        cursor[leaf] = patch.value;
      }
    }
  }

  return clone;
}

/**
 * Computes top-level RFC 6902 JSON Patch operations between two state snapshots.
 */
export function computeJsonPatches(
  prev: Record<string, any> | null | undefined,
  next: Record<string, any> | null | undefined
): JsonPatchOp[] {
  const prevObj = prev && typeof prev === 'object' ? prev : {};
  const nextObj = next && typeof next === 'object' ? next : {};
  const ops: JsonPatchOp[] = [];
  const allKeys = new Set([...Object.keys(prevObj), ...Object.keys(nextObj)]);

  for (const key of allKeys) {
    const escapedKey = key.replace(/~/g, '~0').replace(/\//g, '~1');
    const path = `/${escapedKey}`;
    const hadKey = Object.prototype.hasOwnProperty.call(prevObj, key);
    const hasKey = Object.prototype.hasOwnProperty.call(nextObj, key);

    if (!hadKey && hasKey) {
      ops.push({ op: 'add', path, value: nextObj[key] });
    } else if (hadKey && !hasKey) {
      ops.push({ op: 'remove', path });
    } else if (JSON.stringify(prevObj[key]) !== JSON.stringify(nextObj[key])) {
      ops.push({ op: 'replace', path, value: nextObj[key] });
    }
  }

  return ops;
}

@Injectable({
  providedIn: 'root',
})
export class SharedCanvasService {
  private controllers = new Map<string, MfeCanvasController>();
  private focusedPaths = new Map<string, string>();
  private deferredPatches = new Map<
    string,
    { patches: JsonPatchOp[]; attributions: AiFieldAttribution[] }
  >();
  private attributionsByCanvas = new Map<string, Map<string, AiFieldAttribution>>();

  private activeSelectionSubject = new BehaviorSubject<CanvasSelection | null>(null);
  public activeSelection$: Observable<CanvasSelection | null> =
    this.activeSelectionSubject.asObservable();

  private canvasStateSubject = new Subject<CanvasStateEvent>();
  public canvasState$: Observable<CanvasStateEvent> = this.canvasStateSubject.asObservable();

  registerController(canvasId: string, controller: MfeCanvasController): void {
    this.controllers.set(canvasId, controller);
    if (!this.attributionsByCanvas.has(canvasId)) {
      this.attributionsByCanvas.set(canvasId, new Map());
    }
  }

  unregisterController(canvasId: string): void {
    this.controllers.delete(canvasId);
    this.focusedPaths.delete(canvasId);
    this.deferredPatches.delete(canvasId);
    this.attributionsByCanvas.delete(canvasId);

    const currentSelection = this.activeSelectionSubject.getValue();
    if (currentSelection && currentSelection.canvasId === canvasId) {
      this.activeSelectionSubject.next(null);
    }
  }

  getController(canvasId: string): MfeCanvasController | undefined {
    return this.controllers.get(canvasId);
  }

  setFocusedPath(canvasId: string, path: string | null): void {
    if (path) {
      this.focusedPaths.set(canvasId, path);
      return;
    }

    this.focusedPaths.delete(canvasId);

    // Flush any AI patches that were deferred while the user had keyboard focus
    const deferred = this.deferredPatches.get(canvasId);
    if (deferred && deferred.patches.length > 0) {
      this.deferredPatches.delete(canvasId);
      this.applyPatchToCanvas(canvasId, deferred.patches, deferred.attributions);
    }
  }

  getFocusedPath(canvasId: string): string | null {
    return this.focusedPaths.get(canvasId) ?? null;
  }

  applyPatchToCanvas(
    canvasId: string,
    patches: JsonPatchOp[] | Record<string, any>,
    attributions: AiFieldAttribution[] = []
  ): void {
    const controller = this.controllers.get(canvasId);
    if (!controller) {
      return;
    }

    const focusedPath = this.focusedPaths.get(canvasId);
    let immediatePatches: JsonPatchOp[] | Record<string, any> = patches;
    let immediateAttributions = attributions;

    if (focusedPath && Array.isArray(patches)) {
      const allowed: JsonPatchOp[] = [];
      const blocked: JsonPatchOp[] = [];

      for (const patch of patches) {
        if (patch.path === focusedPath || patch.path.startsWith(`${focusedPath}/`)) {
          blocked.push(patch);
        } else {
          allowed.push(patch);
        }
      }

      if (blocked.length > 0) {
        const existingDeferred = this.deferredPatches.get(canvasId) ?? {
          patches: [],
          attributions: [],
        };
        const blockedAttributions = attributions.filter(
          (a) => a.path === focusedPath || a.path.startsWith(`${focusedPath}/`)
        );
        this.deferredPatches.set(canvasId, {
          patches: [...existingDeferred.patches, ...blocked],
          attributions: [...existingDeferred.attributions, ...blockedAttributions],
        });
      }

      immediatePatches = allowed;
      immediateAttributions = attributions.filter(
        (a) => a.path !== focusedPath && !a.path.startsWith(`${focusedPath}/`)
      );
    }

    if (Array.isArray(immediatePatches) && immediatePatches.length === 0) {
      return;
    }

    const attrMap = this.attributionsByCanvas.get(canvasId) ?? new Map();
    for (const attr of immediateAttributions) {
      attrMap.set(attr.path, attr);
    }
    this.attributionsByCanvas.set(canvasId, attrMap);

    controller.applyPatch(immediatePatches, immediateAttributions);

    const updatedState = controller.getState();
    this.canvasStateSubject.next({
      canvasId,
      source: 'ai',
      state: updatedState,
      patches: Array.isArray(immediatePatches) ? immediatePatches : [],
      attributions: immediateAttributions,
    });
  }

  recordStateChange(canvasId: string, state: any, patches: JsonPatchOp[]): void {
    const attrMap = this.attributionsByCanvas.get(canvasId);
    if (attrMap) {
      for (const patch of patches) {
        attrMap.set(patch.path, { path: patch.path, source: 'user' });
      }
    }

    this.canvasStateSubject.next({
      canvasId,
      source: 'user',
      state,
      patches,
    });
  }

  setActiveSelection(selection: CanvasSelection | null): void {
    this.activeSelectionSubject.next(selection);
  }

  getActiveSelection(): CanvasSelection | null {
    return this.activeSelectionSubject.getValue();
  }

  getCanvasContextSnapshot(canvasId?: string): CanvasContextSnapshot | null {
    const targetId =
      canvasId ??
      this.activeSelectionSubject.getValue()?.canvasId ??
      this.controllers.keys().next().value;

    if (!targetId) {
      return null;
    }

    const controller = this.controllers.get(targetId);
    if (!controller) {
      return null;
    }

    const attrMap = this.attributionsByCanvas.get(targetId);
    return {
      canvasId: targetId,
      state: controller.getState(),
      schema: controller.getSchema(),
      activeSelection: this.activeSelectionSubject.getValue(),
      attributions: attrMap ? Array.from(attrMap.values()) : [],
    };
  }
}
