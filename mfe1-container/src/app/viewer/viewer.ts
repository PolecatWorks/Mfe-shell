import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { SharedContextService } from 'mfe-shared';

@Component({
  selector: 'app-viewer',
  imports: [AsyncPipe, JsonPipe],
  template: `
    <div style="border: 2px dashed blue; padding: 10px; margin-top: 10px;">
      <h2>User Context Viewer</h2>
      @if (sharedContext.context$ | async; as context) {
        <pre>{{ context | json }}</pre>
      } @else {
        <p>No user context set.</p>
      }
    </div>
  `,
  styles: ``,
})
export class Viewer {
  public sharedContext: SharedContextService = inject(SharedContextService);
}
