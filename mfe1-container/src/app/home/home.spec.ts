import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { SharedContextService } from '@polecatworks/mfe-shared';
import { LoggerService } from '../services/logger.service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('Home Component', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let mockSharedContextService: jasmine.SpyObj<SharedContextService>;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let contextSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    mockLoggerService = jasmine.createSpyObj('LoggerService', ['log', 'warn', 'error']);

    mockSharedContextService = jasmine.createSpyObj('SharedContextService', ['getContext', 'setContext']);
    contextSubject = new BehaviorSubject<any>({ name: 'Initial User' });
    (mockSharedContextService as any).context$ = contextSubject.asObservable();
    mockSharedContextService.getContext.and.returnValue({ name: 'Initial User', username: 'initial', roles: [] });

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: SharedContextService, useValue: mockSharedContextService },
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user context information', () => {
    const contextInfoText = fixture.debugElement.query(By.css('.context-info')).nativeElement.textContent;
    expect(contextInfoText).toContain('Name from Context: Initial User');
    expect(contextInfoText).toContain('Current User: Initial User');
  });

  it('should update displayed name when context changes', () => {
    contextSubject.next({ name: 'Updated User' });
    fixture.detectChanges();

    const contextInfoText = fixture.debugElement.query(By.css('.context-info')).nativeElement.textContent;
    expect(contextInfoText).toContain('Name from Context: Updated User');
  });

  it('should call setContext with Rob Roy data when setRobRoy is called', () => {
    component.setRobRoy();
    expect(mockSharedContextService.setContext).toHaveBeenCalledWith({
      name: 'Rob Roy',
      username: 'robroy',
      roles: ['hero']
    });
  });

  it('should trigger setRobRoy on button click', () => {
    const button = fixture.debugElement.query(By.css('button[color="primary"]'));
    button.triggerEventHandler('click', null);

    expect(mockSharedContextService.setContext).toHaveBeenCalledWith({
      name: 'Rob Roy',
      username: 'robroy',
      roles: ['hero']
    });
  });

  it('should have correct initial data for child components', () => {
    expect(component.sampleDiagram).toContain('graph TD');
    expect(component.sampleDiagram).toContain('A[MFE Shell] -->|loads| B(MFE1)');

    expect(component.sampleBarData.length).toBe(4);
    expect(component.sampleBarData[0]).toEqual({ label: 'Apples', value: 45 });

    expect(component.sampleScatterData.length).toBe(2);
    expect(component.sampleScatterData[0].label).toBe('Dataset 1');
    expect(component.sampleScatterData[0].values.length).toBe(5);
  });
});
