import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { JsonShow } from './json-show';

describe('JsonShow', () => {
  let component: JsonShow;
  let fixture: ComponentFixture<JsonShow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonShow]
    }).compileComponents();

    fixture = TestBed.createComponent(JsonShow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly identify objects', () => {
    expect(component.isObject({})).toBeTrue();
    expect(component.isObject({ test: 'value' })).toBeTrue();
    expect(component.isObject(new Date())).toBeTrue(); // Date is an object

    // Non-objects
    expect(component.isObject(null)).toBeFalse();
    expect(component.isObject([])).toBeFalse();
    expect(component.isObject([1, 2, 3])).toBeFalse();
    expect(component.isObject('string')).toBeFalse();
    expect(component.isObject(123)).toBeFalse();
    expect(component.isObject(true)).toBeFalse();
    expect(component.isObject(undefined)).toBeFalse();
  });

  it('should correctly identify arrays', () => {
    expect(component.isArray([])).toBeTrue();
    expect(component.isArray([1, 2, 3])).toBeTrue();
    expect(component.isArray(new Array(5))).toBeTrue();

    // Non-arrays
    expect(component.isArray({})).toBeFalse();
    expect(component.isArray({ test: 'value' })).toBeFalse();
    expect(component.isArray(null)).toBeFalse();
    expect(component.isArray('string')).toBeFalse();
    expect(component.isArray(123)).toBeFalse();
    expect(component.isArray(true)).toBeFalse();
    expect(component.isArray(undefined)).toBeFalse();
  });

  it('should display "No data provided." when content is empty', () => {
    component.content = null;
    fixture.detectChanges();
    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No data provided.');
  });

  it('should render JSON content when provided', () => {
    component.content = { test: 'value' };
    fixture.detectChanges();
    const codeBlock = fixture.nativeElement.querySelector('code');
    expect(codeBlock).toBeTruthy();
    expect(codeBlock.textContent).toContain('"test": "value"');
  });

  it('should copy to clipboard and update copied state', fakeAsync(() => {
    // Spy on clipboard
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

    component.content = { foo: 'bar' };
    fixture.detectChanges();

    component.copyToClipboard();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(JSON.stringify({ foo: 'bar' }, null, 2));

    // Wait for the async promise to resolve
    tick();
    expect(component.copied).toBeTrue();

    // Wait for the setTimeout (2000ms)
    tick(2000);
    expect(component.copied).toBeFalse();
  }));

  it('should not copy to clipboard if content is empty', fakeAsync(() => {
    spyOn(navigator.clipboard, 'writeText');

    component.content = null;
    fixture.detectChanges();

    component.copyToClipboard();
    tick();

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    expect(component.copied).toBeFalse();
  }));

  it('should log error if copy fails', fakeAsync(() => {
    const error = new Error('Clipboard error');
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.reject(error));
    const consoleSpy = spyOn(console, 'error');

    component.content = { foo: 'bar' };
    fixture.detectChanges();

    component.copyToClipboard();
    tick();

    expect(consoleSpy).toHaveBeenCalledWith('Failed to copy: ', error);
    expect(component.copied).toBeFalse();
  }));
});
