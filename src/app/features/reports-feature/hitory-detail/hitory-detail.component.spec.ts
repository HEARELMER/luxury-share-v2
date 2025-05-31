import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitoryDetailComponent } from './hitory-detail.component';

describe('HitoryDetailComponent', () => {
  let component: HitoryDetailComponent;
  let fixture: ComponentFixture<HitoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HitoryDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HitoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
