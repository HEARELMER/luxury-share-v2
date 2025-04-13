import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { Message } from 'primeng/message';
import { InputOtpModule } from 'primeng/inputotp';
import { PasswordComponent } from '../../../shared/components/forms/password/password.component';
import { PasswordService } from '../../../core/services/auth-services/password.service';
import { Step1ValidationComponent } from './steps/step1-validation/step1-validation.component';
import { Step2VerificationComponent } from './steps/step2-verification/step2-verification.component';
import { Step3NewPasswordComponent } from './steps/step3-new-password/step3-new-password.component';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-password-recovery',
  imports: [
    ButtonModule,
    StepperModule, 
    InputOtpModule, 
    ReactiveFormsModule,
    FormsModule,
    Message,
    Step1ValidationComponent,
    Step2VerificationComponent,
    Step3NewPasswordComponent,
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss',
})
export class PasswordRecoveryComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _passwordService = inject(PasswordService);

  // signals
  emailValidated = signal<string>('');
  currentStep = signal<number>(1);
  stepsCompleted = signal<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
  });
  loading = signal<boolean>(false);
  error = signal<string>('');
  responseMessage = signal<string>('');

  // froms
  step1Form = this._fb.group({
    email: this._fb.control('', [
      Validators.required,
      Validators.email,
      Validators.minLength(3),
    ]),
    numDni: this._fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  otpCode = this._fb.control('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern('^[0-9]*$'),
  ]);

  passwordForm = this._fb.group({
    password: this._fb.control('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    passwordConfirm: this._fb.control('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  emailFormControl = this._fb.control('', [
    Validators.required,
    Validators.email,
    Validators.minLength(3),
  ]);

  validateEmailAndNumDni(activateCallback: (step: number) => void) {
    // Mostrar loader
    this.loading.set(true);
    this.error.set('');
    // Extraer valores seguros
    const email = this.step1Form.get('email')?.value || '';
    const numDni = this.step1Form.get('numDni')?.value || '';
    // Llamar al servicio
    this._passwordService.validateEmailAndNumDni({ email, numDni }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.status === 'success') {
          this.emailValidated.set(email);
          this.stepsCompleted.update((steps) => ({ ...steps, 1: true }));
          // Establecer mensaje y navegar al siguiente paso
          this.responseMessage.set(res.message);
          this.currentStep.set(2);
          activateCallback(2);
        } else {
          // Mostrar mensaje de error
          this.error.set(res.message);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message);
      },
    });
  }

  validateCode(activateCallback: (step: number) => void) {
    // Mostrar loader
    this.loading.set(true);
    this.error.set('');

    this._passwordService.validateCode(this.otpCode.value || '').subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.status === 'success') {
          this.stepsCompleted.update((steps) => ({ ...steps, 2: true }));
          // Establecer mensaje y navegar al siguiente paso
          this.responseMessage.set(res.message);
          this.currentStep.set(3);
          activateCallback(3);
        } else {
          // Mostrar mensaje de error
          this.error.set(res.message);
        }
      },
    });
  }

  resetPassword(): void {
    // Validar el formulario primero
    if (this.passwordForm.invalid) {
      Object.values(this.passwordForm.controls).forEach((control) =>
        control.markAsTouched()
      );
      return;
    }

    // Obtener los valores
    const password = this.passwordForm.get('password')?.value || '';
    const confirmPassword =
      this.passwordForm.get('passwordConfirm')?.value || '';

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    // Activar indicador de carga
    this.loading.set(true);
    this.error.set('');

    // Llamar al servicio con los parámetros correctos (newPassword, email)
    this._passwordService
      .passwordRecovery(password, this.emailValidated())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.responseMessage.set(
              res.message || 'Contraseña actualizada correctamente'
            );
            this.stepsCompleted.update((steps) => ({ ...steps, 3: true }));
            setTimeout(() => {
              this._router.navigate(['/auth/login']);
            }, 3000);
          } else {
            this.error.set(
              res.message || 'No se pudo actualizar la contraseña'
            );
          }
        },
        error: (err) => {
          this.error.set(
            err.error?.message || 'Error al actualizar la contraseña'
          );
        },
      });
  }

  goToPreviousStep(activateCallback: (step: number) => void): void {
    this.currentStep.set(this.currentStep() - 1);
    activateCallback(this.currentStep());
  }
  // Verificar si se puede navegar a un paso
  canActivateStep(step: number): boolean {
    // El paso 1 siempre está disponible
    if (step === 1) return true;
    // Para los demás pasos, verificar si el anterior está completado
    return this.stepsCompleted()[step - 1] === true;
  }
}
