import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormSaleComponent } from './edit-form-sale.component';

describe('EditFormSaleComponent', () => {
  let component: EditFormSaleComponent;
  let fixture: ComponentFixture<EditFormSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFormSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFormSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
