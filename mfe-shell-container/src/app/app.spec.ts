import '../test-setup';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { OAuthService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    const mockOAuthService = {
      loadDiscoveryDocumentAndLogin: vi.fn().mockResolvedValue(true),
      events: of({ type: 'token_received' }),
      loadUserProfile: vi.fn().mockResolvedValue(true),
      getIdentityClaims: vi.fn().mockReturnValue({ preferred_username: 'test', name: 'Test User', roles: ['user'] }),
      getAccessToken: vi.fn().mockReturnValue('dummy-token'),
      hasValidAccessToken: vi.fn().mockReturnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: OAuthService, useValue: mockOAuthService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'mfe-shell-container'`, () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('mfe-shell-container');
  });
});
