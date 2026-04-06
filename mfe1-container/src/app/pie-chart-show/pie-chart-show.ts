import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface PieChartData {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'app-pie-chart-show',
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
          <span class="color-box" [style.background-color]="getColor(i, ds.color)"></span>
          <span class="label">{{ ds.label }}: {{ ds.value }}</span>
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

    ::ng-deep .arc path {
      stroke: rgba(15, 23, 42, 0.85); /* Deep slate backdrop to match container */
      stroke-width: 2px;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
    }

    ::ng-deep .arc path:hover {
      opacity: 0.8;
      transform: scale(1.05);
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
export class PieChartShow implements AfterViewInit, OnChanges {
  @Input() title: string = '';
  @Input() content: PieChartData[] = [];

  @ViewChild('svg') svgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private defaultColors = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#22c55e', // Green
    '#eab308', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
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
    const width = containerWidth > 0 ? containerWidth : 400;
    const height = 320;
    const radius = Math.min(width, height) / 2;

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<PieChartData>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(0)
      .outerRadius(radius * 0.8);

    // Tooltip
    d3.select(this.containerRef.nativeElement).selectAll('.tooltip').remove();
    const tooltip = d3.select(this.containerRef.nativeElement)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const arcs = g.selectAll('.arc')
      .data(pie(this.content))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => this.getColor(i, d.data.color))
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`<strong>${d.data.label}</strong><br/>Value: ${d.data.value}`)
          .style('left', (event.pageX - this.containerRef.nativeElement.getBoundingClientRect().left + 10) + 'px')
          .style('top', (event.pageY - this.containerRef.nativeElement.getBoundingClientRect().top - 28) + 'px');
        d3.select(event.currentTarget).transition().duration(200).attr('transform', 'scale(1.05)');
      })
      .on('mouseout', (event) => {
        tooltip.transition().duration(500).style('opacity', 0);
        d3.select(event.currentTarget).transition().duration(200).attr('transform', 'scale(1)');
      });

    // Animation
    arcs.selectAll('path')
      .transition()
      .duration(1000)
      .attrTween('d', function(this: any, d: any) {
        const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return arc(d) as string;
        };
      });
  }
}
