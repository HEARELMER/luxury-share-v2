import { Component, inject, input, model, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { ADD_CLIENT_DOCUMENT_TYPE } from '../constants/add-client.constant';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-edit-form-sale',
  imports: [
    ModalComponent,
    InputFormComponent,
    ReactiveFormsModule,
    FormsModule,
    SelectComponent,JsonPipe
  ],
  templateUrl: './edit-form-sale.component.html',
  styleUrl: './edit-form-sale.component.scss',
})
export class EditFormSaleComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _localStorageService = inject(LocalstorageService);

  showModal = model<boolean>(false);
  saleData = input<any>(null);
  refreshData = output<void>();
  isCompleted = signal<boolean>(false);
  documentTypes = ADD_CLIENT_DOCUMENT_TYPE;

  clientForm = this._fb.group({
    typeDocument: ['', [Validators.required]],
    numberDocument: ['', [Validators.minLength(8), Validators.maxLength(20)]],
    name: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)],
    ],
    firstLastname: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)],
    ],
    secondLastname: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)],
    ],
    email: ['', [Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(9)]],
    birthDate: ['', [Validators.required]],
    registeredBy: [this._localStorageService.getUserId()],
    nationality: [
      '',
      [
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/),
      ],
    ],
  });

  ngOnInit() {
    if (this.saleData()) {
      this.clientForm.patchValue(this.saleData());
    }
  }

  closeModal() {
    this.showModal.set(false);
    if (this.isCompleted()) {
      this.refreshData.emit();
    }
  }
}
