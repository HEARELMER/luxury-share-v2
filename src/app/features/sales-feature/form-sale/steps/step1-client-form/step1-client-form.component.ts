import { Component, input, output } from '@angular/core';
import { InputFormComponent } from '../../../../../shared/components/forms/input-form/input-form.component';
import { SelectComponent } from '../../../../../shared/components/forms/select/select.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { ButtonModule } from 'primeng/button';
import { ADD_CLIENT_DOCUMENT_TYPE } from '../../../constants/add-client.constant';

@Component({
  selector: 'app-step1-client-form',
  imports: [
    InputFormComponent,
    SelectComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './step1-client-form.component.html',
  styleUrl: './step1-client-form.component.scss',
})
export class Step1ClientFormComponent {
  readonly clientForm = input.required<FormGroup>();
  readonly loading = input<boolean>(false);
  readonly submitForm = output<void>();
  readonly searchClient = output<void>();
  documentTypes = ADD_CLIENT_DOCUMENT_TYPE;
  onSubmit() {
    if (this.clientForm().valid) {
      this.submitForm.emit();
    }
  }

  onSearchClient() {
    this.searchClient.emit();
  }
}
