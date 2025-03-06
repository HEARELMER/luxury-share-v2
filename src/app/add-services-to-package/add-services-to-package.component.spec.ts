import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServicesToPackageComponent } from './add-services-to-package.component';

describe('AddServicesToPackageComponent', () => {
  let component: AddServicesToPackageComponent;
  let fixture: ComponentFixture<AddServicesToPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddServicesToPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServicesToPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
