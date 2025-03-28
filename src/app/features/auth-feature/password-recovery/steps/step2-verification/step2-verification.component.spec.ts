import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2VerificationComponent } from './step2-verification.component';

describe('Step2VerificationComponent', () => {
  let component: Step2VerificationComponent;
  let fixture: ComponentFixture<Step2VerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step2VerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step2VerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
