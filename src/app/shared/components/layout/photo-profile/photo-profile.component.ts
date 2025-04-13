import { Component, input, signal } from '@angular/core';
import { InputFileComponent } from '../../forms/input-file/input-file.component';
import { Tooltip } from 'primeng/tooltip';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-photo-profile',
  imports: [],
  templateUrl: './photo-profile.component.html',
  styleUrl: './photo-profile.component.scss',
})
export class PhotoProfileComponent {
  readonly photo = input<string>('');
  loading = signal<boolean>(false);

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.loading.set(true);
      // Aquí iría la lógica para subir la imagen
      setTimeout(() => {
        this.loading.set(false);
      }, 2000);
    }
  }
}
