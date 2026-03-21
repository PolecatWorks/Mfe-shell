import { TestBed } from '@angular/core/testing';
import { SharedOtelService } from './shared-otel.service';
import { SharedContextService } from './shared-context.service';

describe('SharedOtelService', () => {
  let service: SharedOtelService;
  let contextServiceSpy: jasmine.SpyObj<SharedContextService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SharedContextService', ['getContext']);
    TestBed.configureTestingModule({
      providers: [
        SharedOtelService,
        { provide: SharedContextService, useValue: spy }
      ]
    });
    service = TestBed.inject(SharedOtelService);
    contextServiceSpy = TestBed.inject(SharedContextService) as jasmine.SpyObj<SharedContextService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not log if not initialized', () => {
    service.logRecord('error', 'test');
    // No errors thrown, and implicitly no export happens
  });

  it('should initialize and log record', () => {
    service.initialize({ collectorUrl: 'http://localhost:4318/v1/logs', logLevel: 'info' });
    contextServiceSpy.getContext.and.returnValue({ username: 'testuser', roles: ['admin'], name: 'Test' });

    // We mainly test it doesn't crash since OTel global state makes mocking LoggerProvider tricky
    expect(() => service.logRecord('error', 'Test error message')).not.toThrow();
  });
});
