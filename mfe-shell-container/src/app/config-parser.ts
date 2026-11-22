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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireNonEmptyString(value: unknown, fieldPath: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid shell-config.json: "${fieldPath}" must be a non-empty string`);
  }
  return value;
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
      logLevel: requireNonEmptyString(raw['otel']['logLevel'], 'otel.logLevel'),
    };
  }

  return config;
}
