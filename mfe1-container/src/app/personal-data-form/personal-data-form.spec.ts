import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalDataForm } from './personal-data-form';
import { LoggerService } from '../services/logger.service';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

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

  describe('onSubmit', () => {
    it('should emit actionEvent and log success when form is valid', () => {
      spyOn(component.actionEvent, 'emit');

      // Set valid values
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

      // Form is invalid by default because it's empty and fields are required
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
