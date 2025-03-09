import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPackagesSaleFormComponent } from './services-packages-sale-form.component';

describe('ServicesPackagesSaleFormComponent', () => {
  let component: ServicesPackagesSaleFormComponent;
  let fixture: ComponentFixture<ServicesPackagesSaleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesPackagesSaleFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesPackagesSaleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
