import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { SharedContextService } from 'mfe-shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div style="border: 2px dashed red; padding: 10px;">
      <h2>MFE1 Component</h2>
      <p>Name from Context: {{ (contextService.context$ | async)?.name }}</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppComponent {
  contextService = inject(SharedContextService);
}
