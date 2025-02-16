import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
})
export class PasswordComponent {
  @Output() password = new EventEmitter<string>();

  ngDoCheck(): void {
    if (this.form.controls['password'].valid) {
      this.password.emit(this.form.controls['password'].value || '');
    } 
  }

  passwordVisible: boolean = false;
  errorMessage: string = '';
  constructor(private formBuilder: FormBuilder) {}

  form = this.formBuilder.group({
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?!.*\s).{8,20}$/
        ),
      ],
    ],
  });

  showPassword() {
    this.passwordVisible = !this.passwordVisible;
  }
  getStrengthClass(): string {
    this.updateErrorMessage();
    const password = this.form.controls['password'].value;

    if (!password) {
      return 'bg-gray-200';
    }

    let strength = 0;

    if (this.hasMinLength(password)) strength++;
    if (this.hasNumber(password)) strength++;
    if (this.hasLowerCase(password)) strength++;
    if (this.hasUpperCase(password)) strength++;
    if (this.hasSpecialChar(password)) strength++;

    if (strength === 5) {
      return 'w-full bg-green-500';
    } else if (strength >= 3) {
      return 'w-2/3 bg-yellow-500';
    } else if (strength > 0) {
      return 'w-1/3 bg-red-500';
    } else {
      return 'bg-gray-200';
    }
  }

  updateErrorMessage() {
    const password = this.form.controls['password'].value;
    if (!password) {
      this.errorMessage = '';
      return;
    }

    if (!this.hasMinLength(password)) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!this.hasNumber(password)) {
      this.errorMessage = 'La contraseña debe tener al menos un número';
    } else if (!this.hasLowerCase(password)) {
      this.errorMessage =
        'La contraseña debe tener al menos una letra minúscula';
    } else if (!this.hasUpperCase(password)) {
      this.errorMessage =
        'La contraseña debe tener al menos una letra mayúscula';
    } else if (!this.hasSpecialChar(password)) {
      this.errorMessage =
        'La contraseña debe tener al menos un carácter especial';
    } else if (!this.noSpaces(password)) {
      this.errorMessage = 'La contraseña no puede tener espacios';
    } else {
      this.errorMessage = '';
    }
  }

  hasMinLength(password: string): boolean {
    return password.length >= 8;
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
