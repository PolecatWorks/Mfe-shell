import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartShow } from './pie-chart-show';
import { CommonModule } from '@angular/common';
import { SimpleChange } from '@angular/core';

describe('PieChartShow', () => {
  let component: PieChartShow;
  let fixture: ComponentFixture<PieChartShow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, PieChartShow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieChartShow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update chart when content changes', () => {
    const renderSpy = spyOn<any>(component, 'renderChart').and.callThrough();

    component.content = [
      { label: 'A', value: 10 },
      { label: 'B', value: 20 }
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
