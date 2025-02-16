import { Component, Input, input } from '@angular/core';
import { InputFileComponent } from '../../forms/input-file/input-file.component';

@Component({
  selector: 'app-photo-profile',
  standalone: true,
  imports: [InputFileComponent],
  templateUrl: './photo-profile.component.html',
  styleUrl: './photo-profile.component.scss',
})
export class PhotoProfileComponent {
  @Input() photo: string = './assets/icons/userDefault.svg';
}
