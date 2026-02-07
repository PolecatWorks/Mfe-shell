import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { SharedContextService, UserContext } from 'mfe-shared';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  contextService: SharedContextService = inject(SharedContextService);

  setRobRoy() {
    this.contextService.setContext({
      name: 'Rob Roy',
      username: 'robroy',
      roles: ['hero']
    });
  }
}
