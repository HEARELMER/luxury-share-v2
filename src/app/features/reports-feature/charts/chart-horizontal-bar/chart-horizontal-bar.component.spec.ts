import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartHorizontalBarComponent } from './chart-horizontal-bar.component';

describe('ChartHorizontalBarComponent', () => {
  let component: ChartHorizontalBarComponent;
  let fixture: ComponentFixture<ChartHorizontalBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartHorizontalBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartHorizontalBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
