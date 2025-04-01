import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsFormComponent } from './goals-form.component';

describe('GoalsFormComponent', () => {
  let component: GoalsFormComponent;
  let fixture: ComponentFixture<GoalsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
