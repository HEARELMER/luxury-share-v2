import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsPanelComponent } from './charts-panel.component';

describe('ChartsPanelComponent', () => {
  let component: ChartsPanelComponent;
  let fixture: ComponentFixture<ChartsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
