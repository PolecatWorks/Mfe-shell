import { bootstrapApplication } from '@angular/platform-browser';
import { createAppConfig } from './app/app.config';
import { App } from './app/app';
import { MfeConfig } from './app/mfe-config';

export default function bootstrap(config: MfeConfig) {
  return bootstrapApplication(App, createAppConfig(config));
}
