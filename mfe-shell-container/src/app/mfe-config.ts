import { InjectionToken } from '@angular/core';

export interface MfeRouteConfig {
  path: string;
  displayName: string;
  remoteName: string;
  exposedModule: string;
  componentName: string;
}

export interface MenuConfig {
  name: string;
  route: string;
}

export interface OTelConfig {
  collectorUrl: string;
  logLevel: string;
}

export interface MfeConfig {
  remotes: Record<string, string>;
  mfeRoutes: MfeRouteConfig[];
  menu: MenuConfig[];
  otel?: OTelConfig;
}

export const MFE_CONFIG = new InjectionToken<MfeConfig>('MFE_CONFIG');
