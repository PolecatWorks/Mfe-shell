import { describe, it, expect } from 'vitest';
import { parseShellConfig } from './mfe-config';
import { validateAuthConfig } from './auth.config';

describe('parseShellConfig', () => {
  const validPayload = {
    remotes: {
      mfe1: '/mfe/mfe1/remoteEntry.json',
      'angry-agent': '/mfe/angry-agent/remoteEntry.json',
    },
    mfeRoutes: [
      {
        path: 'mfe1',
        displayName: 'MFE 1',
        remoteName: 'mfe1',
        exposedModule: './routes',
        componentName: 'remoteRoutes',
      },
    ],
    menu: [
      { name: 'Home', route: '/home', icon: 'home' },
      { name: 'MFE 1', route: '/home/mfe1' },
    ],
    otel: {
      collectorUrl: 'http://localhost:4318/v1/logs',
      logLevel: 'error',
    },
  };

  it('parses a valid shell-config payload with optional otel block', () => {
    const parsed = parseShellConfig(validPayload);
    expect(parsed).toEqual(validPayload);
  });

  it('parses a valid shell-config payload without optional otel block', () => {
    const { otel: _, ...withoutOtel } = validPayload;
    const parsed = parseShellConfig(withoutOtel);
    expect(parsed).toEqual(withoutOtel);
    expect(parsed.otel).toBeUndefined();
  });

  it('rejects null, primitive, or array root payloads', () => {
    expect(() => parseShellConfig(null)).toThrow(/root payload must be a JSON object/);
    expect(() => parseShellConfig('invalid')).toThrow(/root payload must be a JSON object/);
    expect(() => parseShellConfig([])).toThrow(/root payload must be a JSON object/);
  });

  it('rejects missing or non-record remotes', () => {
    expect(() => parseShellConfig({ ...validPayload, remotes: undefined })).toThrow(/"remotes"/);
    expect(() => parseShellConfig({ ...validPayload, remotes: [] })).toThrow(/"remotes"/);
    expect(() => parseShellConfig({ ...validPayload, remotes: { mfe1: 123 } })).toThrow(
      /remotes\.mfe1/
    );
    expect(() => parseShellConfig({ ...validPayload, remotes: { mfe1: '   ' } })).toThrow(
      /remotes\.mfe1/
    );
  });

  it('rejects missing or invalid mfeRoutes entries', () => {
    expect(() => parseShellConfig({ ...validPayload, mfeRoutes: 'not-an-array' })).toThrow(
      /"mfeRoutes"/
    );
    expect(() => parseShellConfig({ ...validPayload, mfeRoutes: [null] })).toThrow(
      /mfeRoutes\[0\]/
    );
    expect(() =>
      parseShellConfig({
        ...validPayload,
        mfeRoutes: [
          {
            path: 'mfe1',
            displayName: 'MFE 1',
            remoteName: 'mfe1',
            exposedModule: './routes',
            componentName: '',
          },
        ],
      })
    ).toThrow(/mfeRoutes\[0\]\.componentName/);
  });

  it('rejects missing or invalid menu entries', () => {
    expect(() => parseShellConfig({ ...validPayload, menu: {} })).toThrow(/"menu"/);
    expect(() => parseShellConfig({ ...validPayload, menu: [{ name: 'Home' }] })).toThrow(
      /menu\[0\]\.route/
    );
    expect(() =>
      parseShellConfig({
        ...validPayload,
        menu: [{ name: 'Home', route: '/home', icon: '' }],
      })
    ).toThrow(/menu\[0\]\.icon/);
  });

  it('rejects malformed otel config when provided', () => {
    expect(() => parseShellConfig({ ...validPayload, otel: 'bad' })).toThrow(/"otel"/);
    expect(() =>
      parseShellConfig({
        ...validPayload,
        otel: { collectorUrl: '', logLevel: 'info' },
      })
    ).toThrow(/otel\.collectorUrl/);
  });
});

describe('validateAuthConfig', () => {
  const validAuth = {
    issuer: 'https://auth.example.com/realms/demo',
    clientId: 'mfe-shell',
    redirectUri: '/home',
    scope: 'openid profile email',
  };

  it('accepts valid OIDC configuration', () => {
    expect(validateAuthConfig(validAuth)).toEqual(validAuth);
  });

  it('rejects non-object payloads', () => {
    expect(() => validateAuthConfig(null)).toThrow(/JSON object/);
    expect(() => validateAuthConfig([])).toThrow(/JSON object/);
  });

  it('rejects missing or empty required OIDC fields', () => {
    expect(() => validateAuthConfig({ ...validAuth, issuer: '' })).toThrow(/issuer/);
    expect(() => validateAuthConfig({ ...validAuth, clientId: undefined })).toThrow(/clientId/);
    expect(() => validateAuthConfig({ ...validAuth, redirectUri: '   ' })).toThrow(/redirectUri/);
    expect(() => validateAuthConfig({ ...validAuth, scope: 42 })).toThrow(/scope/);
  });
});
