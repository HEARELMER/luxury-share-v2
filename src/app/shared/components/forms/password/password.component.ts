import { NgClass } from '@angular/common';
import { Component, forwardRef, input, model, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordComponent),
      multi: true,
    },
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
})
export class PasswordComponent implements ControlValueAccessor {
  // Inputs
  label = input<string>('Contraseña');
  placeholder = input<string>('Ingrese su contraseña');
  required = input<boolean>(true);
  minLength = input<number>(8);
  maxLength = input<number>(50);
  showStrengthBar = input<boolean>(true);

  // Estado interno
  password = model<string>('');
  passwordVisible = signal(false);
  errorMessage = signal('');
  showError = signal(false);
  disabled = signal(false);
  isTouched = signal(false);

  // Funciones de callback para ControlValueAccessor
  onChange: any = () => {};
  onTouch: any = () => {};

  // Implementación de ControlValueAccessor
  writeValue(value: string): void {
    this.password.set(value || '');
    this.validatePassword();
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

  // Eventos de control
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.password.set(value);
    this.validatePassword();
    this.onChange(value);
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.validatePassword();
    this.onTouch();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((val) => !val);
  }

  // Validación y feedback
  validatePassword(): void {
    const value = this.password();

    if (!value) {
      if (this.required() && this.isTouched()) {
        this.showError.set(true);
        this.errorMessage.set('La contraseña es requerida');
      } else {
        this.showError.set(false);
        this.errorMessage.set('');
      }
      return;
    }

    if (!this.hasMinLength(value)) {
      this.showError.set(true);
      this.errorMessage.set(
        `La contraseña debe tener al menos ${this.minLength()} caracteres`
      );
    } else if (!this.hasNumber(value)) {
      this.showError.set(true);
      this.errorMessage.set('La contraseña debe tener al menos un número');
    } else if (!this.hasLowerCase(value)) {
      this.showError.set(true);
      this.errorMessage.set(
        'La contraseña debe tener al menos una letra minúscula'
      );
    } else if (!this.hasUpperCase(value)) {
      this.showError.set(true);
      this.errorMessage.set(
        'La contraseña debe tener al menos una letra mayúscula'
      );
    } else if (!this.hasSpecialChar(value)) {
      this.showError.set(true);
      this.errorMessage.set(
        'La contraseña debe tener al menos un carácter especial'
      );
    } else if (!this.noSpaces(value)) {
      this.showError.set(true);
      this.errorMessage.set('La contraseña no puede tener espacios');
    } else if (value.length > this.maxLength()) {
      this.showError.set(true);
      this.errorMessage.set(
        `La contraseña no puede exceder los ${this.maxLength()} caracteres`
      );
    } else {
      this.showError.set(false);
      this.errorMessage.set('');
    }
  }

  // Verificadores de seguridad
  getStrengthClass(): string {
    const password = this.password();

    if (!password) {
      return 'w-0 bg-gray-200';
    }

    let strength = 0;

    if (this.hasMinLength(password)) strength++;
    if (this.hasNumber(password)) strength++;
    if (this.hasLowerCase(password)) strength++;
    if (this.hasUpperCase(password)) strength++;
    if (this.hasSpecialChar(password)) strength++;

    if (strength === 5) {
      return 'w-full bg-green-500';
    } else if (strength >= 4) {
      return 'w-4/5 bg-lime-500';
    } else if (strength >= 3) {
      return 'w-3/5 bg-yellow-500';
    } else if (strength >= 2) {
      return 'w-2/5 bg-orange-500';
    } else {
      return 'w-1/5 bg-red-500';
    }
  }

  hasMinLength(password: string): boolean {
    return password.length >= this.minLength();
  }

  hasNumber(password: string): boolean {
    return /\d/.test(password);
  }

  hasLowerCase(password: string): boolean {
    return /[a-z]/.test(password);
  }

  hasUpperCase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  hasSpecialChar(password: string): boolean {
    return /[\W_]/.test(password);
  }

  noSpaces(password: string): boolean {
    return !/\s/.test(password);
  }
}
