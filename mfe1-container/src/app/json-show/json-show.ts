import { Component, Input } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-json-show',
  imports: [JsonPipe],
  template: `
    <div style="border: 2px solid green; padding: 10px; margin-top: 10px;">
      <h2>JSON Show Component</h2>
      @if (data) {
        <pre>{{ data | json }}</pre>
      } @else {
        <p>No data provided.</p>
      }
    </div>
  `,
  styles: ``,
})
export class JsonShow {
  @Input() data: any;
}
