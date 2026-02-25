import '../test-setup';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SharedContextService } from 'mfe-shared';

describe('App', () => {
  beforeEach(async () => {
    // Mock for SharedContextService
    const mockSharedContext = {
      setContext: () => { },
      getContext: () => ({}),
      context$: () => { }
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: SharedContextService, useValue: mockSharedContext }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
