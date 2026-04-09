import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface DataPoint {
  x: any;
  y: number;
}

interface Dataset {
  label: string;
  values: DataPoint[];
  color?: string;
}

@Component({
  selector: 'app-data-show',
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
      <div class="legend" *ngIf="content && content.length > 0">
        <div *ngFor="let ds of content; let i = index" class="legend-item">
          <span class="color-box" [style.background-color]="getColor(i)"></span>
          <span class="label">{{ ds.label }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: rgba(15, 23, 42, 0.85); /* Deep slate backdrop */
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
      color: #f8fafc; /* High contrast white-ish */
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

    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 24px;
      justify-content: center;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .color-box {
      width: 14px;
      height: 14px;
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    }

    .label {
      color: #e2e8f0; /* Slate 200 */
      font-size: 0.9rem;
      font-weight: 500;
    }

    ::ng-deep .axis text {
      fill: #cbd5e1; /* Lighter slate for better contrast on dark background */
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

    ::ng-deep .line {
      fill: none;
      stroke-width: 3.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    ::ng-deep .dot {
      stroke-width: 2.5;
      stroke: rgba(15, 23, 42, 0.8);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    ::ng-deep .dot:hover {
      r: 6;
      stroke-width: 3;
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
  `],
})
export class DataShow implements AfterViewInit, OnChanges, OnDestroy {
  @Input() title: string = '';
  @Input() content: Dataset[] = [];
  @Input() xType: 'time' | 'linear' | 'band' = 'linear';

  @ViewChild('svg') svgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private margin = { top: 20, right: 30, bottom: 40, left: 50 };
  private defaultColors = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#22c55e', // Green
    '#eab308', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
  ];
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    this.renderChart();

    this.resizeObserver = new ResizeObserver(() => {
      this.renderChart();
    });

    if (this.containerRef) {
      this.resizeObserver.observe(this.containerRef.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['content'] || changes['title']) && this.svgRef) {
      this.renderChart();
    }
  }

  public getColor(index: number): string {
    return this.defaultColors[index % this.defaultColors.length];
  }

  private renderChart() {
    if (!this.content || this.content.length === 0 || !this.svgRef) return;

    const svg = d3.select(this.svgRef.nativeElement);
    svg.selectAll('*').remove();

    const width = this.containerRef.nativeElement.clientWidth - this.margin.left - this.margin.right;
    const height = 300 - this.margin.top - this.margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Setup Scales
    let x: any;
    const allX: any[] = [];
    const allY: number[] = [];
    for (const dataset of this.content) {
      for (const value of dataset.values) {
        allX.push(value.x);
        allY.push(value.y);
      }
    }

    if (this.xType === 'time') {
      x = d3.scaleTime()
        .domain(d3.extent(allX) as [Date, Date])
        .range([0, width]);
    } else if (this.xType === 'band') {
      x = d3.scaleBand()
        .domain(allX)
        .range([0, width])
        .padding(0.1);
    } else {
      x = d3.scaleLinear()
        .domain(d3.extent(allX) as [number, number])
        .range([0, width]);
    }

    const y = d3.scaleLinear()
      .domain([0, d3.max(allY) || 100])
      .nice()
      .range([height, 0]);

    // Add Grid Lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(-height).tickFormat(() => ''));

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''));

    // Add Axes
    g.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis y-axis')
      .call(d3.axisLeft(y));

    // Line Generator
    const line = d3.line<DataPoint>()
      .x(d => (this.xType === 'band' ? x(d.x) + x.bandwidth() / 2 : x(d.x)))
      .y(d => y(d.y))
      .curve(d3.curveMonotoneX);

    // Tooltip
    const tooltip = d3.select(this.containerRef.nativeElement)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Draw Lines
    this.content.forEach((dataset, i) => {
      const color = dataset.color || this.getColor(i);

      const path = g.append('path')
        .datum(dataset.values)
        .attr('class', 'line')
        .attr('stroke', color)
        .attr('d', line);

      // Animation
      const length = (path.node() as SVGPathElement).getTotalLength();
      path.attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);

      // Add Dots
      g.selectAll(`.dot-${i}`)
        .data(dataset.values)
        .enter()
        .append('circle')
        .attr('class', `dot dot-${i}`)
        .attr('cx', d => (this.xType === 'band' ? x(d.x) + x.bandwidth() / 2 : x(d.x)))
        .attr('cy', d => y(d.y))
        .attr('r', 4)
        .attr('fill', color)
        .on('mouseover', (event, d) => {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`<strong>${dataset.label}</strong><br/>x: ${d.x}<br/>y: ${d.y}`)
            .style('left', (event.pageX - this.containerRef.nativeElement.getBoundingClientRect().left + 10) + 'px')
            .style('top', (event.pageY - this.containerRef.nativeElement.getBoundingClientRect().top - 28) + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition().duration(500).style('opacity', 0);
        });
    });
  }
}
