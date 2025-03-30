import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleReportDialogComponent } from './schedule-report-dialog.component';

describe('ScheduleReportDialogComponent', () => {
  let component: ScheduleReportDialogComponent;
  let fixture: ComponentFixture<ScheduleReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleReportDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
