import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

import { InputOtpModule } from 'primeng/inputotp';
import { PasswordComponent } from '../../../shared/components/forms/password/password.component';
@Component({
  selector: 'app-password-recovery',
  imports: [
    ButtonModule,
    StepperModule,
    InputFormComponent,
    ButtonComponent,
    InputOtpModule,
    PasswordComponent,
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss',
})
export class PasswordRecoveryComponent {
  private readonly _fb = inject(FormBuilder);
  password = '';
  passwordConfirm = '';
  emailFormControl = this._fb.control('', [
    Validators.required,
    Validators.email,
    Validators.minLength(3),
  ]);

  getPassword(value: any) {
    console.log(value);
    this.password = value;
  }
  getPasswordConfirm(value: any) {
    this.passwordConfirm = value;
  }
}
