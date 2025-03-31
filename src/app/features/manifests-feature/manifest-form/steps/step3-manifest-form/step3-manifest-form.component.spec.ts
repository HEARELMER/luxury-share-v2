import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3ManifestFormComponent } from './step3-manifest-form.component';

describe('Step3ManifestFormComponent', () => {
  let component: Step3ManifestFormComponent;
  let fixture: ComponentFixture<Step3ManifestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3ManifestFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step3ManifestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
