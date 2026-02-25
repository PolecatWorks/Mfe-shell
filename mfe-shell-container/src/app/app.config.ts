import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getRoutes } from './app.routes';
import { MfeConfig } from './mfe-config.model';
import { MFE_CONFIG } from './mfe-config.token';

export function createAppConfig(config: MfeConfig): ApplicationConfig {
  return {
    providers: [
      provideRouter(getRoutes(config)),
      provideAnimationsAsync(),
      { provide: MFE_CONFIG, useValue: config }
    ]
  };
}
