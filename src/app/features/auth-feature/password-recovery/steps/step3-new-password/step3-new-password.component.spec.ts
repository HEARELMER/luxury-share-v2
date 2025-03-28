import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3NewPasswordComponent } from './step3-new-password.component';

describe('Step3NewPasswordComponent', () => {
  let component: Step3NewPasswordComponent;
  let fixture: ComponentFixture<Step3NewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3NewPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step3NewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
