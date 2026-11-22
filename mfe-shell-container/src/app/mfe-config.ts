import { InjectionToken } from '@angular/core';
import type { MfeConfig } from './config-parser';

export type {
  MfeRouteConfig,
  MenuConfig,
  OTelConfig,
  MfeConfig,
} from './config-parser';
export { parseShellConfig } from './config-parser';

export const MFE_CONFIG = new InjectionToken<MfeConfig>('MFE_CONFIG');
