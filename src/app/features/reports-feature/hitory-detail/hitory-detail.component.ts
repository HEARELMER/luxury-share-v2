import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-hitory-detail',
  imports: [DatePipe],
  templateUrl: './hitory-detail.component.html',
  styleUrl: './hitory-detail.component.scss',
})
export class HitoryDetailComponent {
  data = signal<any>({});
  private readonly _config = inject(DynamicDialogConfig);

  ngOnInit() {
    this.data.set(this._config.data);
  }
}
