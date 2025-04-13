import { Component, input, model, output } from '@angular/core';
import { PasswordComponent } from '../../../../../shared/components/forms/password/password.component';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-step3-new-password',
  imports: [PasswordComponent, ButtonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './step3-new-password.component.html',
  styleUrl: './step3-new-password.component.scss',
})
export class Step3NewPasswordComponent {
  readonly newPasswordForm = input.required<FormGroup>();
  readonly loading = model<boolean>(false);
  readonly submitForm = output<void>();
  onSubmit() {
    if (this.newPasswordForm().valid) {
      this.loading.set(true);
      this.submitForm.emit();
    } else {
      this.newPasswordForm().markAllAsTouched();
    }
  }
}
