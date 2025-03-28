import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3SummarySaleComponent } from './step3-summary-sale.component';

describe('Step3SummarySaleComponent', () => {
  let component: Step3SummarySaleComponent;
  let fixture: ComponentFixture<Step3SummarySaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3SummarySaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step3SummarySaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
