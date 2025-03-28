import { Component, input, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-step2-verification',
  imports: [InputOtpModule, ReactiveFormsModule, FormsModule, ButtonModule],
  templateUrl: './step2-verification.component.html',
  styleUrl: './step2-verification.component.scss',
})
export class Step2VerificationComponent {
  readonly otpFormControl = input.required<FormControl>();
  readonly loading = input<boolean>(false);
  readonly submitForm = output<void>();
  readonly previous = output<void>();
  onSubmit() {
    if (this.otpFormControl().valid) {
      this.submitForm.emit();
    }
  }

  onPrevious() {
    this.previous.emit();
  }
}
