import type { OTelConfig, OTelLogLevel, UserContext } from '@polecatworks/mfe-shared';

export type { OTelConfig, OTelLogLevel };

const VALID_OTEL_LOG_LEVELS: readonly OTelLogLevel[] = ['debug', 'info', 'warn', 'error'];

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
  icon?: string;
}

export interface MfeConfig {
  remotes: Record<string, string>;
  mfeRoutes: MfeRouteConfig[];
  menu: MenuConfig[];
  otel?: OTelConfig;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireNonEmptyString(value: unknown, fieldPath: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid shell-config.json: "${fieldPath}" must be a non-empty string`);
  }
  return value;
}

function parseOTelLogLevel(value: unknown): OTelLogLevel {
  const rawLevel = requireNonEmptyString(value, 'otel.logLevel').toLowerCase();
  if (!(VALID_OTEL_LOG_LEVELS as readonly string[]).includes(rawLevel)) {
    throw new Error(
      `Invalid shell-config.json: "otel.logLevel" must be one of ${VALID_OTEL_LOG_LEVELS.join(', ')}`
    );
  }
  return rawLevel as OTelLogLevel;
}

export function parseShellConfig(raw: unknown): MfeConfig {
  if (!isPlainObject(raw)) {
    throw new Error('Invalid shell-config.json: root payload must be a JSON object');
  }

  if (!isPlainObject(raw['remotes'])) {
    throw new Error('Invalid shell-config.json: "remotes" must be a record of string URLs');
  }
  const remotes: Record<string, string> = {};
  for (const [remoteName, remoteUrl] of Object.entries(raw['remotes'])) {
    if (remoteName.trim().length === 0) {
      throw new Error('Invalid shell-config.json: "remotes" keys must be non-empty strings');
    }
    remotes[remoteName] = requireNonEmptyString(remoteUrl, `remotes.${remoteName}`);
  }

  if (!Array.isArray(raw['mfeRoutes'])) {
    throw new Error('Invalid shell-config.json: "mfeRoutes" must be an array');
  }
  const mfeRoutes: MfeRouteConfig[] = raw['mfeRoutes'].map((entry, index) => {
    if (!isPlainObject(entry)) {
      throw new Error(`Invalid shell-config.json: "mfeRoutes[${index}]" must be an object`);
    }
    return {
      path: requireNonEmptyString(entry['path'], `mfeRoutes[${index}].path`),
      displayName: requireNonEmptyString(entry['displayName'], `mfeRoutes[${index}].displayName`),
      remoteName: requireNonEmptyString(entry['remoteName'], `mfeRoutes[${index}].remoteName`),
      exposedModule: requireNonEmptyString(
        entry['exposedModule'],
        `mfeRoutes[${index}].exposedModule`
      ),
      componentName: requireNonEmptyString(
        entry['componentName'],
        `mfeRoutes[${index}].componentName`
      ),
    };
  });

  if (!Array.isArray(raw['menu'])) {
    throw new Error('Invalid shell-config.json: "menu" must be an array');
  }
  const menu: MenuConfig[] = raw['menu'].map((entry, index) => {
    if (!isPlainObject(entry)) {
      throw new Error(`Invalid shell-config.json: "menu[${index}]" must be an object`);
    }
    const item: MenuConfig = {
      name: requireNonEmptyString(entry['name'], `menu[${index}].name`),
      route: requireNonEmptyString(entry['route'], `menu[${index}].route`),
    };
    if (entry['icon'] !== undefined) {
      item.icon = requireNonEmptyString(entry['icon'], `menu[${index}].icon`);
    }
    return item;
  });

  const config: MfeConfig = { remotes, mfeRoutes, menu };

  if (raw['otel'] !== undefined) {
    if (!isPlainObject(raw['otel'])) {
      throw new Error('Invalid shell-config.json: "otel" must be an object when provided');
    }
    config.otel = {
      collectorUrl: requireNonEmptyString(raw['otel']['collectorUrl'], 'otel.collectorUrl'),
      logLevel: parseOTelLogLevel(raw['otel']['logLevel']),
    };
  }

  return config;
}

function asOptionalNonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  return value.filter((item): item is string => typeof item === 'string');
}

export function parseOidcClaims(raw: unknown, accessToken?: string): UserContext {
  const claims: Record<string, unknown> = isPlainObject(raw) ? raw : {};

  const sub = asOptionalNonEmptyString(claims['sub']) ?? '';
  const preferredUsername = asOptionalNonEmptyString(claims['preferred_username']);
  const email = asOptionalNonEmptyString(claims['email']);
  const name = asOptionalNonEmptyString(claims['name']);

  const realmAccess = isPlainObject(claims['realm_access']) ? claims['realm_access'] : undefined;
  const realmRoles = realmAccess ? asStringArray(realmAccess['roles']) : undefined;
  const directRoles = asStringArray(claims['roles']);
  const roles = realmRoles ?? directRoles ?? [];

  const clientRoles: Record<string, string[]> = {};
  if (isPlainObject(claims['resource_access'])) {
    for (const [clientId, access] of Object.entries(claims['resource_access'])) {
      if (isPlainObject(access)) {
        const extracted = asStringArray(access['roles']);
        if (extracted) {
          clientRoles[clientId] = extracted;
        }
      }
    }
  }

  return {
    userId: sub,
    username: preferredUsername ?? email ?? 'Anonymous',
    name: name ?? preferredUsername ?? 'User',
    email,
    roles,
    clientRoles,
    claims,
    accessToken: asOptionalNonEmptyString(accessToken),
  };
}

