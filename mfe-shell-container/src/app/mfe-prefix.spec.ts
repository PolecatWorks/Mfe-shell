import { describe, it, expect } from 'vitest';
import { createRoutes } from './app.routes';
import { MfeConfig } from './mfe-config';

describe('MfeConfig & Route Composition Prefixes', () => {
  const mockConfig: MfeConfig = {
    remotes: {
      'mfe1': '/mfe/mfe1/remoteEntry.json',
      'mfe2': '/mfe/mfe2/remoteEntry.json',
      'angry-agent': '/mfe/angry-agent/remoteEntry.json',
      'aad': '/mfe/aad/remoteEntry.json',
      'data-engine': '/mfe/data-engine/remoteEntry.json',
    },
    mfeRoutes: [
      { path: 'mfe1', displayName: 'MFE 1', remoteName: 'mfe1', exposedModule: './routes', componentName: 'remoteRoutes' },
      { path: 'mfe2', displayName: 'Irish MFE', remoteName: 'mfe2', exposedModule: './Component', componentName: 'Component' },
      { path: 'angry-agent', displayName: 'Angry Agent', remoteName: 'angry-agent', exposedModule: './routes', componentName: 'remoteRoutes' },
      { path: 'aad', displayName: 'Agent as Data', remoteName: 'aad', exposedModule: './routes', componentName: 'remoteRoutes' },
      { path: 'data-engine', displayName: 'Data Engine', remoteName: 'data-engine', exposedModule: './routes', componentName: 'remoteRoutes' },
    ],
    menu: [
      { name: 'Home', route: '/home' },
      { name: 'Base', route: '/home/base' },
      { name: 'MFE 1', route: '/home/mfe1' },
      { name: 'Irish MFE', route: '/home/mfe2' },
      { name: 'Angry Agent', route: '/home/angry-agent' },
      { name: 'Agent as Data', route: '/home/aad' },
      { name: 'Data Engine', route: '/home/data-engine' },
    ]
  };

  it('POSITIVE: all remotes correctly use the /mfe/<service>/remoteEntry.json prefix pattern', () => {
    for (const [remoteName, remoteEntryUrl] of Object.entries(mockConfig.remotes)) {
      expect(remoteEntryUrl).toMatch(/^\/mfe\/[a-z0-9-_]+\/remoteEntry\.json$/);
      expect(remoteEntryUrl).toBe(`/mfe/${remoteName}/remoteEntry.json`);
    }
  });

  it('POSITIVE: creates dynamic routes mapped under /home without path rewrites', () => {
    const routes = createRoutes(mockConfig);
    const homeRoute = routes.find(r => r.path === 'home');
    expect(homeRoute).toBeDefined();

    const children = (homeRoute as any).children;
    expect(children).toBeDefined();

    const registeredPaths = children.map((c: any) => c.path);
    expect(registeredPaths).toContain('mfe1');
    expect(registeredPaths).toContain('mfe2');
    expect(registeredPaths).toContain('angry-agent');
    expect(registeredPaths).toContain('aad');
    expect(registeredPaths).toContain('data-engine');
  });

  it('POSITIVE: distinguishes Angular routes (.routes) from generic component wrappers', () => {
    const routes = createRoutes(mockConfig);
    const homeRoute = routes.find(r => r.path === 'home') as any;

    const angularRoute = homeRoute.children.find((c: any) => c.path === 'angry-agent');
    expect(angularRoute.loadChildren).toBeDefined();
    expect(angularRoute.loadComponent).toBeUndefined();

    const componentRoute = homeRoute.children.find((c: any) => c.path === 'mfe2');
    expect(componentRoute.loadComponent).toBeDefined();
    expect(componentRoute.data.remoteName).toBe('mfe2');
  });

  it('NEGATIVE: rejects or flags remoteEntry URLs missing the /mfe/ prefix', () => {
    const invalidRemotes = {
      legacyRemote1: 'http://localhost:3000/remoteEntry.json',
      legacyRemote2: '/remoteEntry.json',
      serviceFirstRemote: '/angry-agent/mfe/remoteEntry.json',
      apiPrefixRemote: '/api/angry-agent/v1/remoteEntry.json',
    };

    for (const [name, url] of Object.entries(invalidRemotes)) {
      const isValidMfePrefix = /^\/mfe\/[a-z0-9-_]+\/remoteEntry\.json$/.test(url);
      expect(isValidMfePrefix, `Expected remote '${name}' with URL '${url}' to be rejected as invalid MFE prefix`).toBe(false);
    }
  });

  it('NEGATIVE: rejects empty or root remoteEntry prefixes', () => {
    const malformed = ['', '/', '///', 'mfe/mfe1/remoteEntry.json'];
    for (const url of malformed) {
      expect(/^\/mfe\/[a-z0-9-_]+\/remoteEntry\.json$/.test(url)).toBe(false);
    }
  });
});
