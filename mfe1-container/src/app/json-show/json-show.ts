import { Component, Input } from '@angular/core';
import { JsonPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-show',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  template: `
    <div class="json-viewer-container">
      <div class="header">
        <span class="title">JSON Content</span>
        <button class="copy-button" (click)="copyToClipboard()" [class.copied]="copied" title="Copy to clipboard">
          <svg *ngIf="!copied" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <svg *ngIf="copied" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>{{ copied ? 'Copied' : 'Copy' }}</span>
        </button>
      </div>
      <div class="content">
        @if (content) {
          <pre><code>{{ content | json }}</code></pre>
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
      padding: 6px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .title {
      color: #9cdcfe;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.7;
    }

    .copy-button {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #d4d4d4;
      border-radius: 4px;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .copy-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .copy-button.copied {
      border-color: rgba(76, 175, 80, 0.4);
      color: #4caf50;
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
  @Input() content: any = null;
  @Input() expanded: boolean = true;
  copied = false;

  isObject(val: any): boolean {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  async copyToClipboard() {
    if (!this.content) return;

    try {
      const jsonStr = JSON.stringify(this.content, null, 2);
      await navigator.clipboard.writeText(jsonStr);
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
}
