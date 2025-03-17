import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, input, model } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('150ms', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class ModalComponent {
  isOpen = model<boolean>(false);
  title = input<string>('');
  customClass = input<string>('w-auto');
  closeOnBackdrop = input<boolean>(true);
  position= input<string>('center');
  maximizable = input<boolean>(false);
 
  close() {
    this.isOpen.set(false);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget && this.closeOnBackdrop()  ) {
      this.close();
    }

  }
}