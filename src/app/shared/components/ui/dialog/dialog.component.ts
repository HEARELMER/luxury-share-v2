import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogData } from '../../../interfaces/ui/ui.interface';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, ButtonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  dialogData = signal<DialogData>({
    message: '',
    type: 'info',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    showCancel: true,
  });

  private readonly _config = inject(DynamicDialogConfig);
  private readonly _ref = inject(DynamicDialogRef);

  ngOnInit() {
    this.dialogData.set({
      ...this.dialogData(),
      ...this._config.data,
    });
  }

  onConfirm(): void {
    this._ref.close(true);
  }

  onCancel(): void {
    this._ref.close(false);
  }
}
