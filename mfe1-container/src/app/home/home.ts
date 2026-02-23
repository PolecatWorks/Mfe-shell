import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SharedContextService } from 'mfe-shared';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MatButtonModule],
  template: `
    <div style="border: 2px dashed red; padding: 10px; margin-top: 10px;">
        <h2>MFE1 Component (Home)</h2>
        <p>Name from Context: {{ $any(sharedContext.context$ | async)?.name }}</p>
        <p> Name {{sharedContext.getContext()?.name}}</p>

        <button mat-raised-button color="primary" (click)="setRobRoy()">Set Rob Roy</button>
    </div>
  `,
  styles: ``,
})
export class Home {
  public sharedContext: SharedContextService = inject(SharedContextService);

  setRobRoy() {
    this.sharedContext.setContext({
      name: 'Rob Roy',
      username: 'robroy',
      roles: ['hero']
    });
  }
}
