import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalDataForm } from './personal-data-form';
import { LoggerService } from '../services/logger.service';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('PersonalDataForm', () => {
  let component: PersonalDataForm;
  let fixture: ComponentFixture<PersonalDataForm>;
  let loggerServiceMock: jasmine.SpyObj<LoggerService>;

  beforeEach(async () => {
    loggerServiceMock = jasmine.createSpyObj('LoggerService', ['log', 'warn', 'error']);

    await TestBed.configureTestingModule({
      imports: [PersonalDataForm],
      providers: [
        provideNoopAnimations(),
        { provide: LoggerService, useValue: loggerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDataForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    fixture.detectChanges();
    expect(component.form).toBeDefined();
    expect(component.form.get('firstName')?.value).toBe('');
    expect(component.form.get('lastName')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('phoneNumber')?.value).toBe('');
    expect(component.form.get('address')?.value).toBe('');
  });

  it('should patch input values into the form on ngOnInit', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'john.doe@example.com';
    component.phoneNumber = '1234567890';
    component.address = '123 Main St';

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.form.value).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      address: '123 Main St'
    });
  });

  describe('Shared Canvas Bidirectional Co-Editing (MfeCanvasController)', () => {
    beforeEach(() => {
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.email = 'john@example.com';
      component.phoneNumber = '1112223333';
      component.address = '100 First Ave';
      fixture.detectChanges();
    });

    it('should apply RFC 6902 JSON Patch operations in-place without resetting other fields', () => {
      component.applyPatch(
        [
          { op: 'replace', path: '/firstName', value: 'Grace' },
          { op: 'replace', path: '/email', value: 'grace@navy.mil' }
        ],
        [
          { path: '/firstName', source: 'ai', confidence: 0.99, rationale: 'Extracted from prompt' },
          { path: '/email', source: 'ai', confidence: 0.95, rationale: 'Official email' }
        ]
      );

      expect(component.getState()).toEqual({
        firstName: 'Grace',
        lastName: 'Doe',
        email: 'grace@navy.mil',
        phoneNumber: '1112223333',
        address: '100 First Ave'
      });
      expect(component.isAiAttributed('firstName')).toBeTrue();
      expect(component.isAiAttributed('email')).toBeTrue();
      expect(component.isAiAttributed('lastName')).toBeFalse();
    });

    it('should defer incoming AI patches on a currently focused field until blur', () => {
      // User focuses email field to type
      component.onFieldFocus('email', 'Email Address');
      component.form.get('email')?.setValue('user-typing@');

      // AI sends patch for both address and email
      component.applyPatch([
        { op: 'replace', path: '/address', value: '742 Evergreen Terrace' },
        { op: 'replace', path: '/email', value: 'ai-suggested@example.com' }
      ]);

      // Address updates immediately, but email is protected while focused
      expect(component.form.get('address')?.value).toBe('742 Evergreen Terrace');
      expect(component.form.get('email')?.value).toBe('user-typing@');

      // User blurs email field -> deferred AI patch is flushed
      component.onFieldBlur('email');
      expect(component.form.get('email')?.value).toBe('ai-suggested@example.com');
    });

    it('should emit stateChange with RFC 6902 diff patches when user edits a field and clear AI attribution', () => {
      const emittedStates: any[] = [];
      component.stateChange.subscribe((evt) => emittedStates.push(evt));

      // First mark firstName as AI attributed
      component.applyPatch(
        [{ op: 'replace', path: '/firstName', value: 'Grace' }],
        [{ path: '/firstName', source: 'ai' }]
      );
      expect(component.isAiAttributed('firstName')).toBeTrue();

      // Now user edits firstName directly
      component.form.get('firstName')?.setValue('Ada');

      expect(emittedStates.length).toBeGreaterThan(0);
      const latest = emittedStates[emittedStates.length - 1];
      expect(latest.state.firstName).toBe('Ada');
      expect(latest.patches).toContain({ op: 'replace', path: '/firstName', value: 'Ada' });
      expect(component.isAiAttributed('firstName')).toBeFalse();
    });

    it('should emit selectionChange when a user focuses a form field (Point-and-Ask)', () => {
      const selections: any[] = [];
      component.canvasId = 'viz-form-1';
      component.selectionChange.subscribe((sel) => selections.push(sel));

      component.onFieldFocus('phoneNumber', 'Phone Number');

      expect(selections.length).toBe(1);
      expect(selections[0]).toEqual({
        canvasId: 'viz-form-1',
        path: '/phoneNumber',
        label: 'Phone Number',
        context: { field: 'phoneNumber', currentValue: '1112223333' }
      });
    });

    it('should return a valid Draft-07 JSON Schema from getSchema()', () => {
      const schema = component.getSchema();
      expect(schema['$schema']).toBe('http://json-schema.org/draft-07/schema#');
      expect(schema['type']).toBe('object');
      expect(schema['properties']['firstName']).toBeDefined();
      expect(schema['properties']['email']).toBeDefined();
    });
  });

  describe('onSubmit', () => {
    it('should emit actionEvent and log success when form is valid', () => {
      spyOn(component.actionEvent, 'emit');

      component.form.patchValue({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '0987654321',
        address: '456 Oak Ave'
      });

      component.onSubmit();

      const expectedValue = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '0987654321',
        address: '456 Oak Ave'
      };

      expect(loggerServiceMock.log).toHaveBeenCalledWith('Personal Data Form Submitted:', expectedValue);
      expect(component.actionEvent.emit).toHaveBeenCalledWith(expectedValue);
    });

    it('should mark all fields as touched and log warning when form is invalid', () => {
      spyOn(component.form, 'markAllAsTouched');
      spyOn(component.actionEvent, 'emit');

      component.onSubmit();

      expect(loggerServiceMock.warn).toHaveBeenCalledWith('Form is invalid', component.form.errors);
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
      expect(component.actionEvent.emit).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should reset the form and log cancellation', () => {
      spyOn(component.form, 'reset');

      component.onCancel();

      expect(loggerServiceMock.log).toHaveBeenCalledWith('Personal Data Form Canceled');
      expect(component.form.reset).toHaveBeenCalled();
    });
  });
});
