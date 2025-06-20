import { Component, forwardRef, input, model, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFormComponent),
      multi: true,
    },
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
  isPositive = input<boolean>(false);
  value = model<string | Date>('');
  isTouched = signal(false);
  showError = signal(false);
  errorMessage = signal('');
  disabled = signal(false);
  onChange: any = () => {};
  onTouch: any = () => {};
  maxDate = input<Date | null>(null);
  minDate = input<Date | null>(null);
  decimal = input<boolean>(false);
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
    if (this.decimal() && this.type() === 'text') {
      const input = event.target as HTMLInputElement;

      // Allow only numbers and a single decimal point
      input.value = input.value.replace(/[^0-9.]/g, '');

      // Ensure only one decimal point exists
      const parts = input.value.split('.');
      if (parts.length > 2) {
        input.value = parts[0] + '.' + parts[1];
      }

      // Ensure the value is positive
      if (Number(input.value) < 0) {
        input.value = '';
      }

      // Update the value
      this.value.set(input.value);
      this.onChange(input.value);
      this.validateField();
    }
    // Si es un campo numérico y positivo
    if (this.isPositive() && this.type() === 'text') {
      input.value = input.value.replace(/[^0-9]/g, '');

      let value = Number(input.value);
      if (input.value === '') {
        value = 0;
        input.value = '0';
      }

      if (value < 0) {
        value = 0;
        input.value = '0';
        this.showError.set(true);
        this.errorMessage.set('Este campo no puede ser negativo');
      }

      // Si el campo está vacío y es requerido
      if (!input.value && this.required()) {
        this.showError.set(true);
        this.errorMessage.set('Este campo es requerido');
        this.value.set('');
      } else {
        this.value.set(value.toString());
      }

      this.onChange(this.value());
      return;
    }
    this.value.set(input.value);
    this.onChange(input.value);
    this.validateField();
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
