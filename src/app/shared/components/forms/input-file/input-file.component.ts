import { Component, Output, EventEmitter, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-file',
  imports: [CommonModule],
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.scss',
})
export class InputFileComponent {
  readonly accept = input('');
  readonly disabled = input(false);
  readonly multiple = input(false);
  readonly maxSize = input(5); // En MB
  onChange = output<File | File[]>();
  onError = output<string>();

  isDragging = false;

  handleFileInput(event: any): void {
    const files = event.target.files;
    if (!files.length) return;

    if (this.multiple()) {
      this.validateAndEmitFiles(Array.from(files));
    } else {
      this.validateAndEmitFile(files[0]);
    }
  }

  private validateAndEmitFile(file: File): void {
    if (this.validateFile(file)) {
      this.onChange.emit(file);
    }
  }

  private validateAndEmitFiles(files: File[]): void {
    const validFiles = files.filter((file) => this.validateFile(file));
    if (validFiles.length) {
      this.onChange.emit(validFiles);
    }
  }

  private validateFile(file: File): boolean {
    const maxSize = this.maxSize();
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      this.onError.emit(`El archivo excede el tamaño máximo de ${maxSize}MB`);
      return false;
    }
    return true;
  }
}
