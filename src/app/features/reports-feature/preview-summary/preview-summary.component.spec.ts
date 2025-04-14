import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSummaryComponent } from './preview-summary.component';

describe('PreviewSummaryComponent', () => {
  let component: PreviewSummaryComponent;
  let fixture: ComponentFixture<PreviewSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
