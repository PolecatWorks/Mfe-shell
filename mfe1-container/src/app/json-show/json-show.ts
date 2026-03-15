import { Component, Input } from '@angular/core';
import { JsonPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-show',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  template: `
    <div class="json-viewer-container">
      <div class="header">
        <div class="dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <span class="title">JSON Content</span>
      </div>
      <div class="content">
        @if (data) {
          <pre><code>{{ data | json }}</code></pre>
        } @else {
          <div class="empty-state">
            <p>No data provided.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .json-viewer-container {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      overflow: hidden;
      background: #1e1e1e;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
      margin: 12px 0;
      font-family: 'Inter', -apple-system, system-ui, sans-serif;
    }

    .header {
      background: #252526;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .red { background: #ff5f56; }
    .yellow { background: #ffbd2e; }
    .green { background: #27c93f; }

    .title {
      color: #9cdcfe;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.7;
    }

    .content {
      padding: 16px;
      max-height: 450px;
      overflow: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }

    code {
      font-family: 'JetBrains Mono', 'Fira Code', 'Roboto Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #d4d4d4;
    }

    .empty-state {
      color: #858585;
      text-align: center;
      padding: 24px;
      font-size: 14px;
    }
  `],
})
export class JsonShow {
  @Input() data: any;
}
