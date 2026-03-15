import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataShow } from './data-show';

describe('DataShow', () => {
  let component: DataShow;
  let fixture: ComponentFixture<DataShow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataShow]
    }).compileComponents();

    fixture = TestBed.createComponent(DataShow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty datasets by default', () => {
    expect(component.datasets).toEqual([]);
  });

  it('should accept datasets input', () => {
    const mockDatasets = [
      {
        label: 'Test',
        values: [{ x: 1, y: 10 }]
      }
    ];
    component.datasets = mockDatasets;
    expect(component.datasets.length).toBe(1);
    expect(component.datasets[0].label).toBe('Test');
  });
});
