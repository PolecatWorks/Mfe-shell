import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { BaseContent } from './components/base-content/base-content';
import { Profile } from './components/profile/profile';
import { Settings } from './components/settings/settings';
import { HomeComponent } from './components/home/home.component';
import { MfeConfig } from './mfe-config.model';

export function getRoutes(config: MfeConfig): Routes {
  const mfeRoutes = config.mfeRoutes.map(route => ({
    path: route.path,
    loadChildren: () => loadRemoteModule(route.remoteName, route.exposedModule).then(m => m.remoteRoutes)
  }));

  return [
    {
      path: 'home', component: HomeComponent,
      children: [
        { path: 'base', component: BaseContent },
        { path: 'profile', component: Profile },
        { path: 'settings', component: Settings },
        ...mfeRoutes
      ]
    },
    { path: '**', pathMatch: 'full', redirectTo: 'home' },
  ];
}
