import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import mermaid from 'mermaid';

@Component({
  selector: 'app-mermaid-show',
  standalone: true,
  template: `
    <div class="mermaid-container">
      <div #mermaidDiv class="mermaid-target"></div>
    </div>
  `,
  styles: [`
    .mermaid-container {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      margin: 1rem 0;
      transition: all 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100px;
    }
    .mermaid-container:hover {
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    .mermaid-target {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
    }
  `],
})
export class MermaidShow implements AfterViewInit, OnChanges {
  @Input() content: string = '';
  @ViewChild('mermaidDiv') mermaidDiv!: ElementRef;

  private isInitialized = false;

  constructor() {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
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
    console.log('[MermaidShow] Rendering with cleaned content:', cleanContent);

    try {
      const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      const { svg } = await mermaid.render(uniqueId, cleanContent);
      this.mermaidDiv.nativeElement.innerHTML = svg;
    } catch (error) {
      console.error('Mermaid rendering failed', error);
      this.mermaidDiv.nativeElement.innerHTML = `<div style="color: #ff4d4d; font-family: monospace;">Error rendering Mermaid diagram</div>`;
    }
  }
}
