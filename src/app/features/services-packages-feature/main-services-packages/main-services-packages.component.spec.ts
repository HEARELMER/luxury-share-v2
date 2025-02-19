import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainServicesPackagesComponent } from './main-services-packages.component';

describe('MainServicesPackagesComponent', () => {
  let component: MainServicesPackagesComponent;
  let fixture: ComponentFixture<MainServicesPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainServicesPackagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainServicesPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
