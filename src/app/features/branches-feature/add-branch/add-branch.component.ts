import { Component } from '@angular/core';
import { effect, inject, input, model, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ServicesService } from '../../../core/services/services_packages-services/services.service';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { BranchService } from '../../../core/services/braches-services/branch.service';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
@Component({
  selector: 'app-add-branch',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputFormComponent,
    ModalComponent,
    Toast,
    SelectComponent,
  ],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.scss',
})
export class AddBranchComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _branchService = inject(BranchService);
  private readonly _messageService = inject(MessageService);
  private readonly _localStorageService = inject(LocalstorageService);
  showModal = model<boolean>(false);
  refreshData = output<void>();
  isEditing = signal<boolean>(false);
  branchToEdit = input<any>(null);
  isSubmitting = signal<boolean>(false);

  branchForm: FormGroup = this._fb.group({
    address: ['', Validators.required],
    description: ['', Validators.required],
    status: [true],
    registeredBy: [this._localStorageService.getUserId()],
    sucursalId: [''],
  });

  constructor() {
    effect(() => {
      if (this.showModal() && this.branchToEdit()) {
        this.isEditing.set(true);
        this.branchForm.patchValue({
          ...this.branchToEdit(),
          status: this.branchToEdit().status ? 'true' : 'false',
        });
      } else {
        this.isEditing.set(false);
        this.branchForm.reset();
      }
    });
  }

  formatValues() {
    this.branchForm.patchValue({
      status: this.branchForm.value.status === 'true' ? true : false,
      priceUnit: parseFloat(this.branchForm.value.priceUnit),
    });
  }

  onSubmit() {
    if (!this.branchForm.valid) return;
    this.formatValues();
    const formValues = this.filterEmptyValues(this.branchForm.value);
    if (this.isEditing()) {
      this.update(formValues);
    } else {
      this.save(formValues);
    }
  }

  save(data: any) {
    this.isSubmitting.set(true);
    this._branchService.createBranch(data).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sucursal creada correctamente',
        });
        this.isSubmitting.set(false);
        this.closeModal();
        this.refreshData.emit();
      },
      error: (response) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error.message || 'Error al crear la sucursal',
        });
        this.isSubmitting.set(false);
      },
    });
  }

  update(data: any) {
    this.isSubmitting.set(true);
    const formatedData = {
      ...data,
    };
    this._branchService.updateBranch(formatedData).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sucursal actualizada correctamente',
        });
        this.isSubmitting.set(false);
        this.refreshData.emit();
        this.closeModal();
      },
    });
  }

  closeModal() {
    this.showModal.set(false);
    this.branchForm.reset();
    this.isEditing.set(false);
  }

  private filterEmptyValues(formValues: any): any {
    return Object.keys(formValues)
      .filter((key) => formValues[key] !== null && formValues[key] !== '')
      .reduce((obj: any, key) => {
        obj[key] = formValues[key];
        return obj;
      }, {});
  }
}
