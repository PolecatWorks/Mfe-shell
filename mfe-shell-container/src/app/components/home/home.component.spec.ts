import '../../../test-setup';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';
import { MFE_CONFIG } from '../../mfe-config.token';
import { MfeConfig } from '../../mfe-config.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const mockConfig: MfeConfig = {
    remotes: {},
    mfeRoutes: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, HomeComponent],
      providers: [
        provideRouter([]),
        { provide: MFE_CONFIG, useValue: mockConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should render menu button inside toolbar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar button[aria-label="Toggle navigation menu"]')).toBeTruthy();
  });

  it('should render app title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar span.app-title')?.textContent).toContain('MFE Shell');
  });
});
