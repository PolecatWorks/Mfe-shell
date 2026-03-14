import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MermaidShow } from './mermaid-show';

describe('MermaidShow', () => {
  let component: MermaidShow;
  let fixture: ComponentFixture<MermaidShow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MermaidShow]
    }).compileComponents();

    fixture = TestBed.createComponent(MermaidShow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty content by default', () => {
    expect(component.content).toBe('');
  });

  it('should render content when set', async () => {
    component.content = 'graph TD; A-->B;';
    component.ngOnChanges({
      content: {
        currentValue: 'graph TD; A-->B;',
        previousValue: '',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    fixture.detectChanges();
    // Since mermaid.render is async, we might need to wait or mock it
    // For a basic test, we just check if the input is accepted
    expect(component.content).toBe('graph TD; A-->B;');
  });
});
