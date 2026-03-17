import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown-show',
  standalone: true,
  template: `
    <div class="markdown-container">
      <div class="markdown-body" [innerHTML]="renderedHtml"></div>
    </div>
  `,
  styles: [`
    .markdown-container {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 28px 32px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.45);
      margin: 1rem 0;
      transition: all 0.3s ease;
      color: #e2e8f0;
      font-family: 'Inter', -apple-system, system-ui, sans-serif;
      line-height: 1.7;
      font-size: 15px;
    }

    .markdown-container:hover {
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.55);
    }

    /* Headings */
    ::ng-deep .markdown-body h1,
    ::ng-deep .markdown-body h2,
    ::ng-deep .markdown-body h3,
    ::ng-deep .markdown-body h4,
    ::ng-deep .markdown-body h5,
    ::ng-deep .markdown-body h6 {
      color: #f8fafc;
      font-weight: 700;
      margin: 1.5em 0 0.6em 0;
      line-height: 1.3;
      letter-spacing: -0.02em;
    }

    ::ng-deep .markdown-body h1 {
      font-size: 1.85rem;
      padding-bottom: 0.4em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    ::ng-deep .markdown-body h2 {
      font-size: 1.5rem;
      padding-bottom: 0.3em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }

    ::ng-deep .markdown-body h3 { font-size: 1.25rem; }
    ::ng-deep .markdown-body h4 { font-size: 1.1rem; }

    ::ng-deep .markdown-body > *:first-child {
      margin-top: 0;
    }

    /* Paragraphs */
    ::ng-deep .markdown-body p {
      margin: 0.8em 0;
      color: #cbd5e1;
    }

    /* Links */
    ::ng-deep .markdown-body a {
      color: #60a5fa;
      text-decoration: none;
      border-bottom: 1px solid rgba(96, 165, 250, 0.3);
      transition: all 0.2s ease;
    }

    ::ng-deep .markdown-body a:hover {
      color: #93c5fd;
      border-bottom-color: rgba(147, 197, 253, 0.6);
    }

    /* Strong / Emphasis */
    ::ng-deep .markdown-body strong {
      color: #f1f5f9;
      font-weight: 600;
    }

    ::ng-deep .markdown-body em {
      color: #d1d5db;
      font-style: italic;
    }

    /* Inline code */
    ::ng-deep .markdown-body code {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 0.15em 0.4em;
      font-family: 'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace;
      font-size: 0.88em;
      color: #e879f9;
    }

    /* Code blocks */
    ::ng-deep .markdown-body pre {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 18px 20px;
      overflow-x: auto;
      margin: 1.2em 0;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
    }

    ::ng-deep .markdown-body pre code {
      background: none;
      border: none;
      padding: 0;
      color: #e2e8f0;
      font-size: 0.9em;
      line-height: 1.6;
    }

    /* Blockquotes */
    ::ng-deep .markdown-body blockquote {
      border-left: 3px solid #6366f1;
      margin: 1.2em 0;
      padding: 0.6em 1.2em;
      background: rgba(99, 102, 241, 0.08);
      border-radius: 0 8px 8px 0;
      color: #c7d2fe;
    }

    ::ng-deep .markdown-body blockquote p {
      color: #c7d2fe;
      margin: 0.4em 0;
    }

    /* Lists */
    ::ng-deep .markdown-body ul,
    ::ng-deep .markdown-body ol {
      padding-left: 1.6em;
      margin: 0.8em 0;
      color: #cbd5e1;
    }

    ::ng-deep .markdown-body li {
      margin: 0.35em 0;
    }

    ::ng-deep .markdown-body li::marker {
      color: #6366f1;
    }

    /* Tables */
    ::ng-deep .markdown-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.2em 0;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    ::ng-deep .markdown-body thead {
      background: rgba(255, 255, 255, 0.06);
    }

    ::ng-deep .markdown-body th {
      color: #f1f5f9;
      font-weight: 600;
      text-align: left;
      padding: 10px 14px;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }

    ::ng-deep .markdown-body td {
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
    }

    ::ng-deep .markdown-body tr:hover td {
      background: rgba(255, 255, 255, 0.03);
    }

    /* Horizontal rule */
    ::ng-deep .markdown-body hr {
      border: none;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
      margin: 2em 0;
    }

    /* Images */
    ::ng-deep .markdown-body img {
      max-width: 100%;
      border-radius: 10px;
      margin: 1em 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  `],
})
export class MarkdownShow implements OnChanges {
  @Input() content: string = '';

  renderedHtml: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content']) {
      this.renderMarkdown();
    }
  }

  private renderMarkdown() {
    if (!this.content) {
      this.renderedHtml = '';
      return;
    }

    try {
      const html = marked.parse(this.content) as string;
      this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    } catch (error) {
      console.error('Markdown rendering failed', error);
      this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(
        '<div style="color: #ff4d4d; font-family: monospace;">Error rendering markdown</div>'
      );
    }
  }
}
