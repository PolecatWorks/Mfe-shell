import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScatterPlotShow } from './scatter-plot-show';
import { CommonModule } from '@angular/common';
import { SimpleChange } from '@angular/core';

describe('ScatterPlotShow', () => {
  let component: ScatterPlotShow;
  let fixture: ComponentFixture<ScatterPlotShow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ScatterPlotShow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScatterPlotShow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update chart when content changes', () => {
    const renderSpy = spyOn<any>(component, 'renderChart').and.callThrough();

    component.content = [
      {
        label: 'Dataset 1',
        values: [
          { x: 1, y: 10 },
          { x: 2, y: 20 }
        ]
      }
    ];
    component.ngOnChanges({
      content: new SimpleChange(null, component.content, true)
    });

    expect(renderSpy).toHaveBeenCalled();
  });

  it('should use default color if not provided', () => {
    expect(component.getColor(0)).toBe('#6366f1');
    expect(component.getColor(1, '#ffffff')).toBe('#ffffff');
  });
});
