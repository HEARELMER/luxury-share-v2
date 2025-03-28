import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputFormComponent } from '../../../../../shared/components/forms/input-form/input-form.component';

@Component({
  selector: 'app-step1-validation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFormComponent,
    ButtonModule,
  ],
  templateUrl: './step1-validation.component.html',
  styleUrl: './step1-validation.component.scss',
})
export class Step1ValidationComponent {
  readonly step1Form = input.required<FormGroup>();
  readonly loading = input<boolean>(false);
  readonly submitForm = output<void>();
  onSubmit() { 
    if (this.step1Form().valid) {
      this.submitForm.emit();
    }
  }
}
