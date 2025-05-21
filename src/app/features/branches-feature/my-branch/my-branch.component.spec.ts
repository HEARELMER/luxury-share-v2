import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBranchComponent } from './my-branch.component';

describe('MyBranchComponent', () => {
  let component: MyBranchComponent;
  let fixture: ComponentFixture<MyBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBranchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
