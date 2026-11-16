import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { LoggerService } from '../services/logger.service';

export interface FormJsonPatchOp {
  op: 'add' | 'replace' | 'remove';
  path: string;
  value?: any;
}

export interface FormAiAttribution {
  path: string;
  source: 'ai' | 'user';
  confidence?: number;
  rationale?: string;
}

export interface FormCanvasSelection {
  canvasId: string;
  path: string;
  id?: string;
  label: string;
  context?: any;
}

const SNAKE_TO_CAMEL_MAP: Record<string, string> = {
  first_name: 'firstName',
  last_name: 'lastName',
  phone_number: 'phoneNumber',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phoneNumber: 'phoneNumber',
  address: 'address',
};

@Component({
  selector: 'app-personal-data-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './personal-data-form.html',
  styleUrl: './personal-data-form.scss'
})
export class PersonalDataForm implements OnInit, OnDestroy {
  @Input() canvasId: string = 'personal-data-form';
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() email: string = '';
  @Input() phoneNumber: string = '';
  @Input() address: string = '';
  @Input() actions: string[] = ['submit', 'cancel'];

  @Output() actionEvent = new EventEmitter<any>();
  @Output() stateChange = new EventEmitter<{ state: Record<string, any>; patches: FormJsonPatchOp[] }>();
  @Output() selectionChange = new EventEmitter<FormCanvasSelection | null>();

  form: FormGroup;
  focusedField: string | null = null;
  aiAttributions = new Map<string, FormAiAttribution>();

  private deferredFieldPatches = new Map<string, { value: any; attribution?: FormAiAttribution }>();
  private lastSnapshot: Record<string, any> = {};
  private valueChangesSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private logger: LoggerService
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    const initial = {
      firstName: this.firstName || '',
      lastName: this.lastName || '',
      email: this.email || '',
      phoneNumber: this.phoneNumber || '',
      address: this.address || ''
    };
    this.form.patchValue(initial, { emitEvent: false });
    this.lastSnapshot = { ...this.form.getRawValue() };

    this.valueChangesSub = this.form.valueChanges.subscribe((val) => {
      const current = { ...val };
      const patches: FormJsonPatchOp[] = [];
      for (const key of Object.keys(current)) {
        if (this.lastSnapshot[key] !== current[key]) {
          patches.push({
            op: 'replace',
            path: `/${key}`,
            value: current[key]
          });
          // Human edit clears AI attribution badge on the edited field
          this.aiAttributions.delete(key);
        }
      }
      this.lastSnapshot = current;
      if (patches.length > 0) {
        this.stateChange.emit({ state: current, patches });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.valueChangesSub) {
      this.valueChangesSub.unsubscribe();
    }
  }

  onFieldFocus(fieldName: string, label: string): void {
    this.focusedField = fieldName;
    const currentValue = this.form.get(fieldName)?.value ?? '';
    this.selectionChange.emit({
      canvasId: this.canvasId,
      path: `/${fieldName}`,
      label,
      context: { field: fieldName, currentValue }
    });
  }

  onFieldBlur(fieldName: string): void {
    if (this.focusedField === fieldName) {
      this.focusedField = null;
    }
    const deferred = this.deferredFieldPatches.get(fieldName);
    if (deferred !== undefined) {
      this.deferredFieldPatches.delete(fieldName);
      this.form.patchValue({ [fieldName]: deferred.value }, { emitEvent: false });
      this.lastSnapshot[fieldName] = deferred.value;
      if (deferred.attribution) {
        this.aiAttributions.set(fieldName, deferred.attribution);
      }
    }
  }

  isAiAttributed(fieldName: string): boolean {
    return this.aiAttributions.get(fieldName)?.source === 'ai';
  }

  getAiRationale(fieldName: string): string {
    const attr = this.aiAttributions.get(fieldName);
    if (!attr) return '';
    return attr.rationale || 'Updated by AI';
  }

  /**
   * Applies RFC 6902 JSON Patch operations or a partial object in-place
   * without destroying the component or interrupting an actively focused input.
   */
  applyPatch(
    patchesOrPartial: FormJsonPatchOp[] | Record<string, any>,
    attributions: FormAiAttribution[] = []
  ): void {
    if (!patchesOrPartial) return;

    const attrByField = new Map<string, FormAiAttribution>();
    for (const attr of attributions || []) {
      const rawField = attr.path.replace(/^\//, '');
      const normalized = SNAKE_TO_CAMEL_MAP[rawField] || rawField;
      attrByField.set(normalized, attr);
    }

    const fieldUpdates: Record<string, any> = {};

    if (Array.isArray(patchesOrPartial)) {
      for (const patch of patchesOrPartial) {
        if (!patch || typeof patch.path !== 'string') continue;
        const rawField = patch.path.replace(/^\//, '');
        const fieldName = SNAKE_TO_CAMEL_MAP[rawField] || rawField;
        if (!this.form.contains(fieldName)) continue;

        if (patch.op === 'remove') {
          fieldUpdates[fieldName] = '';
        } else if (patch.op === 'add' || patch.op === 'replace') {
          fieldUpdates[fieldName] = patch.value ?? '';
        }
      }
    } else if (typeof patchesOrPartial === 'object') {
      const sourceObj = patchesOrPartial['content'] && typeof patchesOrPartial['content'] === 'object'
        ? patchesOrPartial['content']
        : patchesOrPartial;
      for (const [k, v] of Object.entries(sourceObj)) {
        const fieldName = SNAKE_TO_CAMEL_MAP[k];
        if (fieldName && this.form.contains(fieldName) && v !== undefined) {
          fieldUpdates[fieldName] = v;
        }
      }
    }

    const immediatePatch: Record<string, any> = {};
    for (const [fieldName, value] of Object.entries(fieldUpdates)) {
      const attr = attrByField.get(fieldName) || {
        path: `/${fieldName}`,
        source: 'ai'
      };

      if (this.focusedField === fieldName) {
        this.deferredFieldPatches.set(fieldName, { value, attribution: attr });
      } else {
        immediatePatch[fieldName] = value;
        this.lastSnapshot[fieldName] = value;
        if (attributions && attributions.length > 0) {
          this.aiAttributions.set(fieldName, attr);
        }
      }
    }

    if (Object.keys(immediatePatch).length > 0) {
      this.form.patchValue(immediatePatch, { emitEvent: false });
    }
  }

  getState(): Record<string, any> {
    return this.form.getRawValue();
  }

  getSchema(): Record<string, any> {
    return {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'PersonalDataForm',
      type: 'object',
      properties: {
        firstName: { type: 'string', minLength: 2, description: 'First Name' },
        lastName: { type: 'string', minLength: 2, description: 'Last Name' },
        email: { type: 'string', format: 'email', description: 'Email Address' },
        phoneNumber: { type: 'string', description: 'Phone Number' },
        address: { type: 'string', minLength: 5, description: 'Physical Address' }
      },
      required: ['firstName', 'lastName', 'email', 'phoneNumber', 'address'],
      actions: this.actions
    };
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.logger.log('Personal Data Form Submitted:', this.form.value);
      this.actionEvent.emit(this.form.value);
    } else {
      this.logger.warn('Form is invalid', this.form.errors);
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.logger.log('Personal Data Form Canceled');
    this.aiAttributions.clear();
    this.form.reset();
  }
}
