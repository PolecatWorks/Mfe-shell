export interface MfeRoute {
  path: string;
  displayName: string;
  remoteName: string;
  exposedModule: string;
}

export interface MfeConfig {
  remotes: Record<string, string>;
  mfeRoutes: MfeRoute[];
}
