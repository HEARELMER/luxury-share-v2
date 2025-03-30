import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDounghnutComponent } from './chart-dounghnut.component';

describe('ChartDounghnutComponent', () => {
  let component: ChartDounghnutComponent;
  let fixture: ComponentFixture<ChartDounghnutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartDounghnutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartDounghnutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
