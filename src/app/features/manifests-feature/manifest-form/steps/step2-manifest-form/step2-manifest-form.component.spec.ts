import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2ManifestFormComponent } from './step2-manifest-form.component';

describe('Step2ManifestFormComponent', () => {
  let component: Step2ManifestFormComponent;
  let fixture: ComponentFixture<Step2ManifestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step2ManifestFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step2ManifestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
