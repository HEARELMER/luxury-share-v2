import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesForSelectedComponent } from './branches-for-selected.component';

describe('BranchesForSelectedComponent', () => {
  let component: BranchesForSelectedComponent;
  let fixture: ComponentFixture<BranchesForSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchesForSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchesForSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
