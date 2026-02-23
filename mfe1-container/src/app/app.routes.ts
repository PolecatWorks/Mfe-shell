import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Chooser } from './chooser/chooser';
import { Viewer } from './viewer/viewer';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'chooser', component: Chooser },
    { path: 'viewer', component: Viewer }
];
