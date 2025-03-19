import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp'; 
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { PasswordComponent } from '../../../shared/components/forms/password/password.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { MessageAlert } from '../../../shared/interfaces/messageAlert';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { AuthService } from '../../../core/services/auth-services/auth.service';
@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [
    NgClass,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    PasswordComponent,
    AlertComponent,
    InputOtpModule,
    FormsModule,
    InputFormComponent,
  ],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.scss',
})
export class RecoveryPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  messageAlert: MessageAlert | null = null;
  emailIsValid: boolean = false;
  codeIsValid: boolean = false;
  isLoading: boolean = false;
  value: any;
  password = '';
  passwordConfirm = '';
  NUM_DNI = '';
  constructor(
    private readonly authService: AuthService,
    private router: Router
  ) {}

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  savePassword() {
    // if (
    //   this.password === this.passwordConfirm &&
    //   this.NUM_DNI.length >= 8 &&
    //   this.NUM_DNI.length < 9
    // ) {
    //   this.authService
    //     .passwordRecovery(this.NUM_DNI, this.password)
    //     .subscribe((isSuccess) => {
    //       if (isSuccess) {
    //         this.codeIsValid = false;
    //         this.messageAlert = {
    //           type: 'success',
    //           title: '¡Contraseña actualizada!',
    //           message: 'Tu contraseña ha sido actualizada exitosamente.',
    //         };
    //         setTimeout(() => {
    //           this.router.navigate(['/login']);
    //         }, 3000);
    //       }
    //     });
    // } else {
    //   this.messageAlert = {
    //     type: 'error',
    //     title: '¡Error!',
    //     message: 'Las contraseñas no coinciden.',
    //   };
    // }
  }
  getPassword(value: any) {
    console.log(value);
    this.password = value;
  }
  getPasswordConfirm(value: any) {
    this.passwordConfirm = value;
  }

  getValueNumDni(value: string) {
    this.NUM_DNI = value;
    console.log('gaaa');
  }

  close() {
    this.codeIsValid = false;
  }
  validateCode() {
    // if (this.form.controls.email.valid && this.value && !this.isLoading) {
    //   this.isLoading = true; // Activar bandera de carga
    //   const data = {
    //     email: this.form.controls.email.value as string,
    //     code: this.value as string,
    //   };
    //   this.authService.validateCodeForPasswordRecovery(data).subscribe(
    //     (response: MessageAlert) => {
    //       this.messageAlert = response;
    //       this.isLoading = false;
    //       this.codeIsValid = true;
    //       setTimeout(() => {
    //         this.messageAlert = null;
    //       }, 3000);
    //     },
    //     () => {
    //       this.isLoading = false;
    //     }
    //   );
    // }
  }
  validateEmail() {
    // if (this.form.controls.email.valid && !this.isLoading) {
    //   this.isLoading = true;
    //   this.authService
    //     .validateEmailForPasswordRecovery(this.form.controls.email.value || '')
    //     .subscribe((response: MessageAlert) => {
    //       this.messageAlert = response;
    //       response.type === 'success'
    //         ? (this.emailIsValid = true)
    //         : (this.emailIsValid = false);
    //       this.isLoading = false;
    //       setTimeout(() => {
    //         this.messageAlert = null;
    //       }, 3000);
    //     });
    // }
  }
}
