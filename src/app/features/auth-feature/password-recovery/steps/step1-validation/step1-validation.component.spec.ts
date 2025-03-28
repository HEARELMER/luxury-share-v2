import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1ValidationComponent } from './step1-validation.component';

describe('Step1ValidationComponent', () => {
  let component: Step1ValidationComponent;
  let fixture: ComponentFixture<Step1ValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step1ValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step1ValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
