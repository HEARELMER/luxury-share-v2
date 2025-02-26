import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.scss'
})
export class InputFileComponent {
  @Input() accept = '';
  @Input() disabled = false;
  @Input() multiple = false;
  @Input() maxSize = 5; // En MB
  @Output() onChange = new EventEmitter<File | File[]>();
  @Output() onError = new EventEmitter<string>();

  isDragging = false;

  handleFileInput(event: any): void {
    const files = event.target.files;
    if (!files.length) return;

    if (this.multiple) {
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
    const validFiles = files.filter(file => this.validateFile(file));
    if (validFiles.length) {
      this.onChange.emit(validFiles);
    }
  }

  private validateFile(file: File): boolean {
    if (this.maxSize && file.size > this.maxSize * 1024 * 1024) {
      this.onError.emit(`El archivo excede el tamaño máximo de ${this.maxSize}MB`);
      return false;
    }
    return true;
  }
}