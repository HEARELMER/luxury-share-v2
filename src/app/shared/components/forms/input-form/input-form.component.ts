import { NgClass } from '@angular/common';
import {
  Component,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule ],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFormComponent),
      multi: true
    }
  ],
})
export class InputFormComponent implements ControlValueAccessor {
  errorType = input<string>('');
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  required = input<boolean>(false);
  maxLength = input<number>(250);
  readonly = input<boolean>(false);
  value = model<string>('');
  isTouched = signal(false);
  showError = signal(false);
  errorMessage = signal('');
  disabled = signal(false);
  onChange: any = () => {};
  onTouch: any = () => {};

  inputClasses = signal(`
    ${this.showError() ? 'border-red-500' : 'border-gray-300'}
  `);

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onTouched(): void {
    this.isTouched.set(true);
    this.onTouch();
    this.validateField();
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.onChange(input.value);
    
    if (input.value) {
      this.showError.set(false);
      this.errorMessage.set('');
    } else {
      this.validateField();
    }
  }

  private validateField(): void {
    if (this.required() && !this.value() && this.isTouched()) {
      this.showError.set(true);
      this.errorMessage.set('Este campo es requerido');
    } else {
      this.showError.set(false);
      this.errorMessage.set('');
    }
  }
}
