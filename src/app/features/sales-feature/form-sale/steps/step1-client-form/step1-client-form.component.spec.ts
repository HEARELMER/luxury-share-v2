import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1ClientFormComponent } from './step1-client-form.component';

describe('Step1ClientFormComponent', () => {
  let component: Step1ClientFormComponent;
  let fixture: ComponentFixture<Step1ClientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step1ClientFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step1ClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
