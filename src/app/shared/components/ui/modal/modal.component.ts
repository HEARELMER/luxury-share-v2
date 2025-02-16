import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title: string='modal';
  @Input() show: boolean=true;
  @Input() confirm: Function=()=>{};
  @Input() cancel: Function=()=>{};
  @Input() confirmText: string='Confirm';
  @Input() cancelText: string='Cancel';
  @Input() confirmClass: string='btn-primary';
  @Input() cancelClass: string='btn-secondary';
  @Input() confirmDisabled: boolean=false;
  @Input() cancelDisabled: boolean=false;
  @Input() confirmIcon: string='';
  @Input() cancelIcon: string='';
  @Input() confirmIconClass: string='';
  @Input() cancelIconClass: string='';
  @Input() style: string='w-auto h-auto lg:w-[80%] lg:h-[80%]';
 
  constructor() { }

  closeHandler() {
    this.show = false;
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeHandler();
    }
  }
}
