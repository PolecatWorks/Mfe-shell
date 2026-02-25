import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MfeConfig, MFE_CONFIG } from './mfe-config';
import { createRoutes } from './app.routes';

export const createAppConfig = (config: MfeConfig): ApplicationConfig => ({
  providers: [
    provideRouter(createRoutes(config)),
    provideAnimationsAsync(),
    { provide: MFE_CONFIG, useValue: config }
  ]
});
