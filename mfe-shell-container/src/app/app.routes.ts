import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { BaseContent } from './components/base-content/base-content';
import { Profile } from './components/profile/profile';
import { Settings } from './components/settings/settings';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
    children: [
      { path: 'base', component: BaseContent },
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings },
      {
        path: 'mfe1',
        loadChildren: () => loadRemoteModule('mfe1', './routes').then(m => m.remoteRoutes)
      },
      {
        path: 'mfe2',
        loadComponent: () => import('./components/mfe2-wrapper/mfe2-wrapper.component').then(m => m.Mfe2WrapperComponent)
      },
      {
        path: 'angry-agent',
        loadChildren: () => loadRemoteModule('angry-agent', './routes').then(m => m.remoteRoutes)
      },
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];
