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
    try {
      const module = await loadRemoteModule('mfe1', './Viewer');
      this.viewerComponent = module.Viewer;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading Viewer component from mfe1:', error);
    }

    try {
      const module = await loadRemoteModule('mfe1', './JsonShow');
      this.jsonShowComponent = module.JsonShow;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading JsonShow component from mfe1:', error);
    }

    try {
      const module = await loadRemoteModule('mfe1', './MermaidShow');
      this.mermaidShowComponent = module.MermaidShow;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading MermaidShow component from mfe1:', error);
    }

    try {
      const module = await loadRemoteModule('mfe1', './MarkdownShow');
      this.markdownShowComponent = module.MarkdownShow;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading MarkdownShow component from mfe1:', error);
    }

    try {
      const module = await loadRemoteModule('mfe1', './TextShow');
      this.textShowComponent = module.TextShow;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading TextShow component from mfe1:', error);
    }

    try {
      const module = await loadRemoteModule('mfe1', './SampleForm');
      this.sampleFormComponent = module.SampleForm;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading SampleForm component from mfe1:', error);
    }

    try {
      const module = await loadRemoteModule('mfe1', './PieChartShow');
      this.pieChartShowComponent = module.PieChartShow;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading PieChartShow component from mfe1:', error);
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
