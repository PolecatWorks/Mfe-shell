import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'app-bar-chart-show',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" #container>
      <div class="chart-header" *ngIf="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="svg-wrapper">
        <svg #svg></svg>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 28px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);
      margin: 1.5rem 0;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .chart-container:hover {
      border-color: rgba(255, 255, 255, 0.25);
      box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.6);
      transform: translateY(-4px);
    }

    .chart-header h3 {
      margin: 0 0 20px 0;
      color: #f8fafc;
      font-weight: 600;
      font-size: 1.25rem;
      letter-spacing: -0.025em;
    }

    .svg-wrapper {
      width: 100%;
      height: 320px;
      position: relative;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    ::ng-deep .axis text {
      fill: #cbd5e1;
      font-size: 11px;
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 500;
    }

    ::ng-deep .axis line, ::ng-deep .axis path {
      stroke: rgba(255, 255, 255, 0.3);
    }

    ::ng-deep .grid line {
      stroke: rgba(255, 255, 255, 0.12);
    }

    ::ng-deep .grid path {
      stroke-width: 0;
    }

    ::ng-deep .bar {
      transition: opacity 0.3s ease;
      cursor: pointer;
    }

    ::ng-deep .bar:hover {
      opacity: 0.8;
    }

    ::ng-deep .tooltip {
      position: absolute;
      padding: 8px 12px;
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: white;
      font-size: 12px;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      z-index: 100;
    }
  `]
})
export class BarChartShow implements AfterViewInit, OnChanges {
  @Input() title: string = '';
  @Input() content: BarChartData[] = [];

  @ViewChild('svg') svgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private margin = { top: 20, right: 30, bottom: 40, left: 50 };
  private defaultColors = [
    '#6366f1', '#ec4899', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4'
  ];

  @HostListener('window:resize')
  onResize() {
    this.renderChart();
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['content'] || changes['title']) && this.svgRef) {
      this.renderChart();
    }
  }

  public getColor(index: number, color?: string): string {
    return color || this.defaultColors[index % this.defaultColors.length];
  }

  private renderChart() {
    if (!this.content || this.content.length === 0 || !this.svgRef) return;

    const svg = d3.select(this.svgRef.nativeElement);
    svg.selectAll('*').remove();

    const containerWidth = this.containerRef.nativeElement.clientWidth;
    const width = (containerWidth > 0 ? containerWidth : 400) - this.margin.left - this.margin.right;
    const height = 320 - this.margin.top - this.margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const x = d3.scaleBand()
      .domain(this.content.map(d => d.label))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.content, d => d.value) || 100])
      .nice()
      .range([height, 0]);

    // Grid
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''));

    // Axes
    g.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis y-axis')
      .call(d3.axisLeft(y));

    // Tooltip
    d3.select(this.containerRef.nativeElement).selectAll('.tooltip').remove();
    const tooltip = d3.select(this.containerRef.nativeElement)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Bars
    g.selectAll('.bar')
      .data(this.content)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', (d, i) => this.getColor(i, d.color))
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.text('');
        tooltip.append('strong').text(d.label);
        tooltip.append('br');
        tooltip.append('span').text(`Value: ${d.value}`);
        tooltip
          .style('left', (event.pageX - this.containerRef.nativeElement.getBoundingClientRect().left + 10) + 'px')
          .style('top', (event.pageY - this.containerRef.nativeElement.getBoundingClientRect().top - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value));
  }
}
