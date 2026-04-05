import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import mermaid from 'mermaid';
import DOMPurify from 'dompurify';
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
    .mermaid-target svg .label {
      fill: #1d1b20 !important;
      color: #1d1b20 !important;
    }
    .mermaid-target svg .label text {
      fill: #1d1b20 !important;
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
      theme: 'base',
      themeVariables: {
        primaryColor: '#eef2ff',
        primaryTextColor: '#1d1b20',
        primaryBorderColor: '#003ec7',
        lineColor: '#49454f',
        secondaryColor: '#f8faff',
        tertiaryColor: '#ffffff',
        fontSize: '14px',
        fontFamily: 'Manrope, sans-serif',
      },
      securityLevel: 'loose',
      htmlLabels: false, // Disable HTML labels to use SVG text elements (more compatible with DOMPurify)
      flowchart: {
        htmlLabels: false,
        useMaxWidth: true,
      }
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
    
    // Strip HTML tags from the mermaid code to prevent foreignObject issues and DOMPurify stripping
    cleanContent = cleanContent.replace(/<[^>]*>/g, '');
    
    cleanContent = cleanContent.trim();
    this.logger.log('[MermaidShow] Rendering with cleaned content:', cleanContent);

    try {
      const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      const { svg } = await mermaid.render(uniqueId, cleanContent);
      
      // Sanitize the SVG output from mermaid. 
      // Since we disabled htmlLabels, we don't need highly complex rules for foreignObject.
      const sanitizedSvg = DOMPurify.sanitize(svg, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ADD_TAGS: ['style', 'defs', 'marker'],
        ADD_ATTR: ['class', 'style', 'width', 'height', 'x', 'y', 'transform', 'viewBox', 'xmlns', 'fill', 'stroke', 'd', 'points', 'r', 'cx', 'cy', 'x1', 'y1', 'x2', 'y2', 'marker-end', 'xmlns:xlink'],
      });
      this.mermaidDiv.nativeElement.innerHTML = sanitizedSvg;
    } catch (error) {
      this.logger.error('Mermaid rendering failed', error);
      this.mermaidDiv.nativeElement.innerHTML = `<div style="color: #ff4d4d; font-family: monospace;">Error rendering Mermaid diagram</div>`;
    }
  }
}
