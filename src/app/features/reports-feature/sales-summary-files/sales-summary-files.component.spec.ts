import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSummaryFilesComponent } from './sales-summary-files.component';

describe('SalesSummaryFilesComponent', () => {
  let component: SalesSummaryFilesComponent;
  let fixture: ComponentFixture<SalesSummaryFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesSummaryFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesSummaryFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
