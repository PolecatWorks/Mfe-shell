import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { BaseContent } from './components/base-content/base-content';
import { Profile } from './components/profile/profile';
import { Settings } from './components/settings/settings';
import { HomeComponent } from './components/home/home.component';
import { MfeConfig, MfeRouteConfig } from './mfe-config';

export const createRoutes = (config: MfeConfig): Routes => {
  const dynamicRoutes: Routes = (config.mfeRoutes || []).map((mfe: MfeRouteConfig) => {
    // Heuristic: If exposedModule ends with "routes" or componentName is "remoteRoutes", assume Angular routes.
    // Otherwise assume Component (React/Other) to be wrapped.
    const isAngularRoutes = mfe.exposedModule.endsWith('routes') || mfe.componentName === 'remoteRoutes';

    if (isAngularRoutes) {
      return {
        path: mfe.path,
        loadChildren: () => loadRemoteModule(mfe.remoteName, mfe.exposedModule)
          .then(m => m[mfe.componentName])
      };
    } else {
      return {
        path: mfe.path,
        loadComponent: () => import('./components/generic-mfe-wrapper/generic-mfe-wrapper.component')
          .then(m => m.GenericMfeWrapperComponent),
        data: {
          remoteName: mfe.remoteName,
          exposedModule: mfe.exposedModule,
          componentName: mfe.componentName
        }
      };
    }
  });

  return [
    {
      path: 'home', component: HomeComponent,
      children: [
        { path: 'base', component: BaseContent },
        { path: 'profile', component: Profile },
        { path: 'settings', component: Settings },
        ...dynamicRoutes
      ]
    },
    { path: '**', pathMatch: 'full', redirectTo: 'home' },
  ];
};
