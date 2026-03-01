import { Component, OnInit, Type } from '@angular/core';
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

  constructor(
    public context: SharedContextService
  ) { }

  async ngOnInit() {
    try {
      const module = await loadRemoteModule('mfe1', './Viewer');
      this.viewerComponent = module.Viewer;
    } catch (error) {
      console.error('Error loading Viewer component from mfe1:', error);
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
