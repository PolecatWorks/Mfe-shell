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
    .text-container {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 24px 28px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.45);
      margin: 1rem 0;
      transition: all 0.3s ease;
      color: #e2e8f0;
      font-family: 'Inter', -apple-system, system-ui, sans-serif;
    }

    .text-container:hover {
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.55);
    }

    .text-content {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: inherit;
      font-size: 15px;
      line-height: 1.6;
      color: #cbd5e1;
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
