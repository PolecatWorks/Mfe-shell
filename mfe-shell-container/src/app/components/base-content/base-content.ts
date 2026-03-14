import { Component, OnInit, Type, ChangeDetectorRef } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SharedContextService } from 'mfe-shared';
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
