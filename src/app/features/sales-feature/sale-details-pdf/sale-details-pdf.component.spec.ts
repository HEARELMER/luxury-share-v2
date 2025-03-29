import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDetailsPdfComponent } from './sale-details-pdf.component';

describe('SaleDetailsPdfComponent', () => {
  let component: SaleDetailsPdfComponent;
  let fixture: ComponentFixture<SaleDetailsPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDetailsPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleDetailsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
