import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedContextService } from 'mfe-shared';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'mfe-shell-container';

  constructor(private sharedContext: SharedContextService) {
    console.log('App: SharedContextService injected');
    this.sharedContext.setContext({ username: 'ShellUser', name: 'Ben', roles: ['admin'] });
  }
}
