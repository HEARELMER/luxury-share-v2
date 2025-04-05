import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestDetailComponent } from './manifest-detail.component';

describe('ManifestDetailComponent', () => {
  let component: ManifestDetailComponent;
  let fixture: ComponentFixture<ManifestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManifestDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManifestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
