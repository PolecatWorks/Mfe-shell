import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SharedContextService } from 'mfe-shared';

@Component({
  selector: 'base-content',
  imports: [MatButtonModule],
  templateUrl: './base-content.html',
  styleUrl: './base-content.scss',
})
export class BaseContent {
  constructor(
    public context: SharedContextService
  ) { }

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
