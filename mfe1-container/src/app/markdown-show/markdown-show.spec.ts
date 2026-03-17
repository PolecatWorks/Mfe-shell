import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownShow } from './markdown-show';

describe('MarkdownShow', () => {
  let component: MarkdownShow;
  let fixture: ComponentFixture<MarkdownShow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownShow]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownShow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty content by default', () => {
    expect(component.content).toBe('');
  });

  it('should render markdown content when set', () => {
    component.content = '# Hello World';
    component.ngOnChanges({
      content: {
        currentValue: '# Hello World',
        previousValue: '',
        firstChange: true,
        isFirstChange: () => true
      }
    });
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.markdown-body');
    expect(container.innerHTML).toContain('<h1');
    expect(container.innerHTML).toContain('Hello World');
  });

  it('should render bold and italic text', () => {
    component.content = '**bold** and *italic*';
    component.ngOnChanges({
      content: {
        currentValue: '**bold** and *italic*',
        previousValue: '',
        firstChange: true,
        isFirstChange: () => true
      }
    });
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.markdown-body');
    expect(container.innerHTML).toContain('<strong>bold</strong>');
    expect(container.innerHTML).toContain('<em>italic</em>');
  });

  it('should handle empty content gracefully', () => {
    component.content = '';
    component.ngOnChanges({
      content: {
        currentValue: '',
        previousValue: 'old',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    fixture.detectChanges();

    expect(component.renderedHtml).toBe('');
  });
});
