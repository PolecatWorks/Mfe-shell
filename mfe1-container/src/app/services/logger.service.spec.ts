import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';
import { SharedOtelService } from '@polecatworks/mfe-shared';
import * as core from '@angular/core';

describe('LoggerService', () => {
  let service: LoggerService;
  let otelServiceSpy: jasmine.SpyObj<SharedOtelService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SharedOtelService', ['logRecord']);

    TestBed.configureTestingModule({
      providers: [
        LoggerService,
        { provide: SharedOtelService, useValue: spy }
      ]
    });
    service = TestBed.inject(LoggerService);
    otelServiceSpy = TestBed.inject(SharedOtelService) as jasmine.SpyObj<SharedOtelService>;
  });

  afterEach(() => {
    // Restore any spies if needed
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Note: core.isDevMode is not mockable in Jasmine tests without specialized loaders because
  // it is exported as a read-only variable in ESM. We will test based on its actual value
  // (which is true in the test environment).

  it('should call console.log and otelService.logRecord on log() if isDevMode()', () => {
    spyOn(console, 'log');
    service.log('test message', 'param1');

    if (core.isDevMode()) {
      expect(console.log).toHaveBeenCalledWith('test message', 'param1');
    } else {
      expect(console.log).not.toHaveBeenCalled();
    }
    expect(otelServiceSpy.logRecord).toHaveBeenCalledWith('info', 'test message param1');
  });

  it('should call console.warn and otelService.logRecord on warn() if isDevMode()', () => {
    spyOn(console, 'warn');
    service.warn('test warning', { k: 'v' });

    if (core.isDevMode()) {
      expect(console.warn).toHaveBeenCalledWith('test warning', { k: 'v' });
    } else {
      expect(console.warn).not.toHaveBeenCalled();
    }
    expect(otelServiceSpy.logRecord).toHaveBeenCalledWith('warn', 'test warning {"k":"v"}');
  });

  it('should call console.error and otelService.logRecord on error() if isDevMode()', () => {
    spyOn(console, 'error');
    service.error('test error');

    if (core.isDevMode()) {
      expect(console.error).toHaveBeenCalledWith('test error');
    } else {
      expect(console.error).not.toHaveBeenCalled();
    }
    expect(otelServiceSpy.logRecord).toHaveBeenCalledWith('error', 'test error');
  });

  describe('formatMessage', () => {
    it('should format a simple string', () => {
      service.log('hello');
      expect(otelServiceSpy.logRecord).toHaveBeenCalledWith('info', 'hello');
    });

    it('should format a string with string params', () => {
      service.log('hello', 'world', '!');
      expect(otelServiceSpy.logRecord).toHaveBeenCalledWith('info', 'hello world !');
    });

    it('should format an object message', () => {
      service.log({ a: 1 });
      expect(otelServiceSpy.logRecord).toHaveBeenCalledWith('info', '{"a":1}');
    });

    it('should format mixed params', () => {
      service.log('status:', { code: 404 }, 'not found');
      expect(otelServiceSpy.logRecord).toHaveBeenCalledWith('info', 'status: {"code":404} not found');
    });

    it('should handle no params gracefully', () => {
      service.log();
      expect(otelServiceSpy.logRecord).toHaveBeenCalledWith('info', undefined as unknown as string);
    });
  });
});
