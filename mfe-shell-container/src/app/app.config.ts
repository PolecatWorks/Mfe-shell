import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideOAuthClient, OAuthService } from 'angular-oauth2-oidc';
import { MfeConfig, MFE_CONFIG } from './mfe-config';
import { createRoutes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { initializeAuthConfig } from './auth.config';

export const createAppConfig = (config: MfeConfig): ApplicationConfig => ({
  providers: [
    provideRouter(createRoutes(config)),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([authInterceptor])),
    provideOAuthClient(),
    { provide: MFE_CONFIG, useValue: config },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuthConfig,
      deps: [HttpClient, OAuthService],
      multi: true,
    },
  ]
});
