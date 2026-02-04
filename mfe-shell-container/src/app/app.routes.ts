import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { Home } from './home/home';
import { Profile } from './profile/profile';
import { Settings } from './settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'profile', component: Profile },
  { path: 'settings', component: Settings },
  {
    path: 'mfe1',
    loadComponent: () => loadRemoteModule('mfe1', './Component').then(m => m.AppComponent)
  },
];
