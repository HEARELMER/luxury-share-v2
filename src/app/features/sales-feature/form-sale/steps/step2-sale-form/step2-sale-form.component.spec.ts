import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2SaleFormComponent } from './step2-sale-form.component';

describe('Step2SaleFormComponent', () => {
  let component: Step2SaleFormComponent;
  let fixture: ComponentFixture<Step2SaleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step2SaleFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step2SaleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
