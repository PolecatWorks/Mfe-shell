import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import mermaid from 'mermaid';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-mermaid-show',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mermaid-container">
      @if (title) {
        <h3 class="mermaid-title">{{ title }}</h3>
      }
      <div #mermaidDiv class="mermaid-target"></div>
    </div>
  `,
  styles: [`
    .mermaid-container {
      background: #fdfdfd;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e1e2e4;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      margin: 1rem 0;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100px;
    }
    .mermaid-title {
      margin: 0 0 16px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1d1b20;
      align-self: flex-start;
      font-family: 'Manrope', sans-serif;
    }
    .mermaid-container:hover {
      border-color: #003ec7;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 62, 199, 0.08);
    }
    .mermaid-target {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
    }
    .mermaid-target svg {
      max-width: 100% !important;
      height: auto !important;
      border-radius: 8px;
    }
  `],
})
export class MermaidShow implements AfterViewInit, OnChanges {
  @Input() title: string = '';
  @Input() content: string = '';
  @ViewChild('mermaidDiv') mermaidDiv!: ElementRef;

  private isInitialized = false;

  constructor(private logger: LoggerService) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      themeVariables: {
        primaryColor: '#e1e2e4',
        primaryTextColor: '#1d1b20',
        primaryBorderColor: '#79747e',
        lineColor: '#49454f',
        secondaryColor: '#fef7ff',
        tertiaryColor: '#f3edf7',
        fontSize: '14px',
        fontFamily: 'Manrope, sans-serif',
      },
      securityLevel: 'loose',
    });
  }

  ngAfterViewInit() {
    this.isInitialized = true;
    this.renderDiagram();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content'] && !changes['content'].isFirstChange() && this.isInitialized) {
      this.renderDiagram();
    }
  }

  private async renderDiagram() {
    if (!this.content || !this.mermaidDiv) return;

    let cleanContent = this.content.trim();
    // Strip markdown code fences if present via regex
    cleanContent = cleanContent.replace(/^```[a-z]*\s*\n?/i, '').replace(/\n?```\s*$/i, '');
    cleanContent = cleanContent.trim();
    this.logger.log('[MermaidShow] Rendering with cleaned content:', cleanContent);

    try {
      const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      const { svg } = await mermaid.render(uniqueId, cleanContent);
      this.mermaidDiv.nativeElement.innerHTML = svg;
    } catch (error) {
      this.logger.error('Mermaid rendering failed', error);
      this.mermaidDiv.nativeElement.innerHTML = `<div style="color: #ff4d4d; font-family: monospace;">Error rendering Mermaid diagram</div>`;
    }
  }
}
