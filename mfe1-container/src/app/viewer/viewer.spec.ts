import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Viewer } from './viewer';
import { SharedContextService, UserContext } from '@polecatworks/mfe-shared';
import { BehaviorSubject } from 'rxjs';

describe('Viewer', () => {
  let component: Viewer;
  let fixture: ComponentFixture<Viewer>;
  let mockContextSubject: BehaviorSubject<UserContext | null>;

  beforeEach(async () => {
    mockContextSubject = new BehaviorSubject<UserContext | null>(null);

    const mockSharedContextService = {
      context$: mockContextSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [Viewer],
      providers: [
        { provide: SharedContextService, useValue: mockSharedContextService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Viewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "No user context set." when context is null', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('No user context set.');
  });

  it('should display user context json when context is available', () => {
    const mockContext: UserContext = {
      username: 'testuser',
      roles: ['admin'],
      name: 'Test User'
    };

    mockContextSubject.next(mockContext);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const preElement = compiled.querySelector('pre');
    expect(preElement).toBeTruthy();
    expect(preElement?.textContent).toContain('"username": "testuser"');
    expect(preElement?.textContent).toContain('"roles"');
    expect(preElement?.textContent).toContain('"admin"');
  });
});
