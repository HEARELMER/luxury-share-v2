import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsPanelComponent } from './goals-panel.component';

describe('GoalsPanelComponent', () => {
  let component: GoalsPanelComponent;
  let fixture: ComponentFixture<GoalsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
