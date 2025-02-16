import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.scss',
})
export class InputFileComponent {
  @Input() text: string = 'default';
  @Input() accept: string = '';
  @Input() bg_color: string = 'bg-primary-l-500 text-white';
  @Input() moreClasses: string = '';
}
