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
        loadComponent: () => loadRemoteModule('mfe1', './Component').then(m => m.AppComponent)
      },
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];
