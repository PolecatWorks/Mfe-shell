import { bootstrapApplication } from '@angular/platform-browser';
import { createAppConfig } from './app/app.config';
import { App } from './app/app';
import { MfeConfig } from './app/mfe-config.model';

export function bootstrap(config: MfeConfig) {
  bootstrapApplication(App, createAppConfig(config))
    .catch((err) => console.error(err));
}
