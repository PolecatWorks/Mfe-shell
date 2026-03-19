import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-show',
  standalone: true,
  template: `
    <div class="text-container">
      <pre class="text-content">{{ displayText }}</pre>
    </div>
  `,
  styles: [`

    .text-content {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: inherit;
      font-size: 15px;
      line-height: 1.6;
    }
  `],
})
export class TextShow {
  @Input() content: any = '';

  get displayText(): string {
    if (this.content && typeof this.content === 'object') {
      return this.content.content || '';
    }
    return this.content || '';
  }
}
