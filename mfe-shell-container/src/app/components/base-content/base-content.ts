import { Component, OnInit, Type, ChangeDetectorRef } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SharedContextService } from '@polecatworks/mfe-shared';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'base-content',
  imports: [MatButtonModule, NgComponentOutlet],
  templateUrl: './base-content.html',
  styleUrl: './base-content.scss',
})
export class BaseContent implements OnInit {
  viewerComponent: Type<any> | null = null;
  jsonShowComponent: Type<any> | null = null;
  mermaidShowComponent: Type<any> | null = null;
  markdownShowComponent: Type<any> | null = null;
  textShowComponent: Type<any> | null = null;
  sampleFormComponent: Type<any> | null = null;
  pieChartShowComponent: Type<any> | null = null;

  sampleTextContent = 'This is a simple text provision that can be used before, after, and between more elaborate components.\nIt only supports line wrapping and basic styling.';

  sampleMermaidContent = `
    graph LR
      Shell[MFE Shell] -- loads --> M1[MFE1]
      M1 -- provides --> MS{MermaidShow}
      MS -- renders --> Result[Federated Diagram]
  `;

  sampleJsonData = {
    name: 'Sample User',
    age: 30,
    hobbies: ['reading', 'coding', 'gaming']
  };

  sampleMarkdownContent = `
# Markdown Show Demo
This is a **federated** markdown component loaded from \`mfe1\`.

### Features:
- Rendered using \`marked\`
- Styled with glassmorphism
- Part of the orchestrator workflow
  `;

  samplePieChartData = [
    { label: 'Category A', value: 30 },
    { label: 'Category B', value: 50 },
    { label: 'Category C', value: 20 },
    { label: 'Category D', value: 15 }
  ];

  constructor(
    public context: SharedContextService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    await Promise.all([
      this.loadRemoteComponent('mfe1', './Viewer', 'Viewer', (comp) => this.viewerComponent = comp),
      this.loadRemoteComponent('mfe1', './JsonShow', 'JsonShow', (comp) => this.jsonShowComponent = comp),
      this.loadRemoteComponent('mfe1', './MermaidShow', 'MermaidShow', (comp) => this.mermaidShowComponent = comp),
      this.loadRemoteComponent('mfe1', './MarkdownShow', 'MarkdownShow', (comp) => this.markdownShowComponent = comp),
      this.loadRemoteComponent('mfe1', './TextShow', 'TextShow', (comp) => this.textShowComponent = comp),
      this.loadRemoteComponent('mfe1', './SampleForm', 'SampleForm', (comp) => this.sampleFormComponent = comp),
      this.loadRemoteComponent('mfe1', './PieChartShow', 'PieChartShow', (comp) => this.pieChartShowComponent = comp)
    ]);
  }

  private async loadRemoteComponent(remoteName: string, exposedModule: string, componentName: string, assignComponent: (comp: Type<any>) => void) {
    try {
      const module = await loadRemoteModule(remoteName, exposedModule);
      assignComponent(module[componentName]);
      this.cdr.detectChanges();
    } catch (error) {
      console.error(`Error loading ${componentName} component from ${remoteName}:`, error);
    }
  }

  pressA() {
    this.context.setContext({
      username: 'Ben',
      roles: ['admin'],
      name: 'Ben Greene'
    });
  }

  pressB() {
    this.context.setContext({
      username: 'Jane',
      roles: ['user'],
      name: 'Jane Doe'
    });
  }
}
