import '../../../test-setup';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseContent } from './base-content';

describe('BaseContent', () => {
  let component: BaseContent;
  let fixture: ComponentFixture<BaseContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseContent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BaseContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
