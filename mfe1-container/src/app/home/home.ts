import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SharedContextService } from '@polecatworks/mfe-shared';
import { MatButtonModule } from '@angular/material/button';
import { MermaidShow } from '../mermaid-show/mermaid-show';
import { BarChartShow } from '../bar-chart-show/bar-chart-show';
import { ScatterPlotShow } from '../scatter-plot-show/scatter-plot-show';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MatButtonModule, MermaidShow, BarChartShow, ScatterPlotShow],
  template: `
    <div class="home-container">
        <h2>MFE1 Component (Home)</h2>
        <div class="context-info">
          <p>Name from Context: {{ $any(sharedContext.context$ | async)?.name }}</p>
          <p>Current User: {{sharedContext.getContext()?.name}}</p>
          <button mat-raised-button color="primary" (click)="setRobRoy()">Set Rob Roy</button>
        </div>

        <div class="demo-section">
          <h3>Mermaid Diagram Show</h3>
          <app-mermaid-show [content]="sampleDiagram"></app-mermaid-show>
        </div>

        <div class="demo-section">
          <h3>Bar Chart Show</h3>
          <app-bar-chart-show title="Fruit Sales" [content]="sampleBarData"></app-bar-chart-show>
        </div>

        <div class="demo-section">
          <h3>Scatter Plot Show</h3>
          <app-scatter-plot-show title="Random Points" [content]="sampleScatterData"></app-scatter-plot-show>
        </div>
    </div>
  `,
  styles: [`
    .home-container {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      margin-top: 10px;
      background: rgba(255, 255, 255, 0.02);
    }
    .context-info {
      margin-bottom: 2rem;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }
    .demo-section {
      margin-top: 2rem;
    }
    h2, h3 {
      color: #fff;
      margin-bottom: 1rem;
    }
  `],
})
export class Home {
  public sharedContext: SharedContextService = inject(SharedContextService);

  sampleDiagram = `
    graph TD
      A[MFE Shell] -->|loads| B(MFE1)
      A -->|loads| C(MFE2)
      B -->|renders| D{MermaidShow}
      D -->|Result| E[Beautiful Diagrams]
  `;

  sampleBarData = [
    { label: 'Apples', value: 45 },
    { label: 'Oranges', value: 30 },
    { label: 'Bananas', value: 70 },
    { label: 'Pears', value: 20 }
  ];

  sampleScatterData = [
    {
      label: 'Dataset 1',
      values: [
        { x: 10, y: 20 },
        { x: 20, y: 50 },
        { x: 30, y: 40 },
        { x: 40, y: 80 },
        { x: 50, y: 30 }
      ]
    },
    {
      label: 'Dataset 2',
      values: [
        { x: 15, y: 10 },
        { x: 25, y: 30 },
        { x: 35, y: 60 },
        { x: 45, y: 40 },
        { x: 55, y: 70 }
      ]
    }
  ];

  setRobRoy() {
    this.sharedContext.setContext({
      name: 'Rob Roy',
      username: 'robroy',
      roles: ['hero']
    });
  }
}
