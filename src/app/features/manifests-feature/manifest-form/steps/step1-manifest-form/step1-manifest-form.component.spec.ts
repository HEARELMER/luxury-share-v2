import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1ManifestFormComponent } from './step1-manifest-form.component';

describe('Step1ManifestFormComponent', () => {
  let component: Step1ManifestFormComponent;
  let fixture: ComponentFixture<Step1ManifestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step1ManifestFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step1ManifestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
