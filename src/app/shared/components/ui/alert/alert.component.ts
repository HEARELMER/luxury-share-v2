import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [ ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  @Input() type: string = 'info'; // 'success', 'error', 'warning', etc.
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() autoClose: boolean = false;
  @Input() duration: number = 3000; // default 3 seconds
  @Input() closeModal:boolean=false;
  show: boolean = true;

  ngOnInit() {
    if (this.autoClose) {
      setTimeout(() => this.show = false, this.duration);
    }
  }

  
  close() {
    this.show = false;
  }
}
