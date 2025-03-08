import { Component, inject, model } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-view-user-info',
  imports: [Tag],
  templateUrl: './view-user-info.component.html',
  styleUrl: './view-user-info.component.scss',
})
export class ViewUserInfoComponent {
  userId = model<string>('');
  private readonly _config = inject(DynamicDialogConfig);

  ngOnInit() {
    this.userId.set(this._config.data);
  }
}
