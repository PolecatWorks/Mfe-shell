import { TestBed } from '@angular/core/testing';
import {
  SharedCanvasService,
  MfeCanvasController,
  JsonPatchOp,
  AiFieldAttribution,
  CanvasSelection,
  applyJsonPatches,
  computeJsonPatches,
} from './shared-canvas.service';

describe('SharedCanvasService & RFC 6902 Patch Utilities', () => {
  let service: SharedCanvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedCanvasService],
    });
    service = TestBed.inject(SharedCanvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('applyJsonPatches', () => {
    it('should apply replace, add, and remove operations on top-level and nested paths', () => {
      const initial = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        fields: [
          { name: 'total_cents', unit: 'unknown' },
          { name: 'customer_id', unit: 'id' },
        ],
      };

      const patches: JsonPatchOp[] = [
        { op: 'replace', path: '/firstName', value: 'Grace' },
        { op: 'replace', path: '/fields/0/unit', value: 'USD' },
        { op: 'add', path: '/phoneNumber', value: '+1-555-0100' },
        { op: 'remove', path: '/lastName' },
      ];

      const updated = applyJsonPatches(initial, patches);

      expect(updated.firstName).toBe('Grace');
      expect((updated as any).lastName).toBeUndefined();
      expect((updated as any).phoneNumber).toBe('+1-555-0100');
      expect(updated.fields[0].unit).toBe('USD');
      expect(updated.fields[1].unit).toBe('id');
      // Original should remain immutable
      expect(initial.firstName).toBe('John');
      expect(initial.fields[0].unit).toBe('unknown');
    });

    it('should support partial object merge when non-array patches are provided', () => {
      const initial = { firstName: 'John', email: 'john@example.com' };
      const updated = applyJsonPatches(initial, { firstName: 'Ada' });
      expect(updated).toEqual({ firstName: 'Ada', email: 'john@example.com' });
    });
  });

  describe('computeJsonPatches', () => {
    it('should compute RFC 6902 replace, add, and remove patches between two objects', () => {
      const prev = { firstName: 'John', email: 'john@example.com', temp: 'old' };
      const next = { firstName: 'Jane', email: 'john@example.com', address: '123 Main St' };

      const patches = computeJsonPatches(prev, next);

      expect(patches).toContainEqual({ op: 'replace', path: '/firstName', value: 'Jane' });
      expect(patches).toContainEqual({ op: 'add', path: '/address', value: '123 Main St' });
      expect(patches).toContainEqual({ op: 'remove', path: '/temp' });
      expect(patches.find((p) => p.path === '/email')).toBeUndefined();
    });
  });

  describe('Controller Registration & Active-Focus Lock Protection', () => {
    it('should register a controller, expose its snapshot, and defer AI patches on focused paths until blur', () => {
      let internalState: Record<string, any> = {
        firstName: 'Alice',
        email: 'alice@ typing...',
      };
      const appliedAttributions: AiFieldAttribution[] = [];

      const mockController: MfeCanvasController = {
        applyPatch: (patches, attributions) => {
          internalState = applyJsonPatches(internalState, patches);
          if (attributions) {
            appliedAttributions.push(...attributions);
          }
        },
        getState: () => internalState,
        getSchema: () => ({
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            email: { type: 'string' },
          },
        }),
        unmount: () => {},
      };

      service.registerController('viz-101', mockController);

      // Simulate user currently holding keyboard focus in /email
      service.setFocusedPath('viz-101', '/email');

      // AI sends patches for both /firstName and /email
      const aiPatches: JsonPatchOp[] = [
        { op: 'replace', path: '/firstName', value: 'Alicia' },
        { op: 'replace', path: '/email', value: 'alicia@corp.com' },
      ];
      const attributions: AiFieldAttribution[] = [
        { path: '/firstName', source: 'ai', confidence: 0.98, rationale: 'Normalized name' },
        { path: '/email', source: 'ai', confidence: 0.95, rationale: 'Corporate domain' },
      ];

      service.applyPatchToCanvas('viz-101', aiPatches, attributions);

      // /firstName is updated immediately, but /email is protected while focused
      expect(internalState['firstName']).toBe('Alicia');
      expect(internalState['email']).toBe('alice@ typing...');

      // Now user blurs /email -> deferred patch is flushed automatically
      service.setFocusedPath('viz-101', null);
      expect(internalState['email']).toBe('alicia@corp.com');

      const snapshot = service.getCanvasContextSnapshot('viz-101');
      expect(snapshot).toBeTruthy();
      expect(snapshot?.state).toEqual({
        firstName: 'Alicia',
        email: 'alicia@corp.com',
      });
      expect(snapshot?.schema['type']).toBe('object');
    });

    it('should track Point-and-Ask active selection and clear it when owning canvas unregisters', () => {
      const mockController: MfeCanvasController = {
        applyPatch: () => {},
        getState: () => ({}),
        getSchema: () => ({}),
        unmount: () => {},
      };

      service.registerController('viz-202', mockController);

      const selection: CanvasSelection = {
        canvasId: 'viz-202',
        path: '/fields/3',
        label: 'orders.total_cents',
        context: { dataType: 'INT64' },
      };

      service.setActiveSelection(selection);
      expect(service.getActiveSelection()).toEqual(selection);

      service.unregisterController('viz-202');
      expect(service.getActiveSelection()).toBeNull();
    });
  });
});
