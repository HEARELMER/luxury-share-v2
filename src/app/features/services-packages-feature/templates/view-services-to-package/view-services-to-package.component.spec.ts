import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServicesToPackageComponent } from './view-services-to-package.component';

describe('ViewServicesToPackageComponent', () => {
  let component: ViewServicesToPackageComponent;
  let fixture: ComponentFixture<ViewServicesToPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewServicesToPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewServicesToPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
