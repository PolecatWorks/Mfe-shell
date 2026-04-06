import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Chooser } from './chooser/chooser';
import { Viewer } from './viewer/viewer';
import { MermaidShow } from './mermaid-show/mermaid-show';
import { DataShow } from './data-show/data-show';
import { PieChartShow } from './pie-chart-show/pie-chart-show';
import { SampleForm } from './sample-form/sample-form';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'chooser', component: Chooser },
    { path: 'viewer', component: Viewer },
    { path: 'mermaid', component: MermaidShow },
    { path: 'data', component: DataShow },
    { path: 'pie-chart', component: PieChartShow },
    { path: 'sample-form', component: SampleForm }
];

export const remoteRoutes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: routes
    }
];
