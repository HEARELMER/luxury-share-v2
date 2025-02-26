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
  showModal = model<boolean>(false);
  refreshData = output<void>();
  isEditing = signal<boolean>(false);
  serviceToEdit = input<any>(null);
  isSubmitting = signal<boolean>(false);

  branchForm: FormGroup = this._fb.group({
    address: ['', Validators.required],
    description: ['', Validators.required],
    status: [true],
    registeredBy: ['', Validators.minLength(8)],
  });

  constructor() {
    effect(() => {
      if (this.showModal() && this.serviceToEdit()) {
        this.isEditing.set(true);
        this.branchForm.patchValue(this.serviceToEdit());
      } else {
        this.isEditing.set(false);
        this.branchForm.reset();
      }
    });
  }

  formatValues() {
    this.branchForm.patchValue({
      registeredBy: '34855749',
      priceUnit: parseFloat(this.branchForm.value.priceUnit),
    });
  }

  onSubmit() {
    if (!this.branchForm.valid) return;
    this.formatValues();
    if (this.isEditing()) {
      this.update(this.branchForm.value);
    } else {
      this.save(this.branchForm.value);
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
        this.closeModal();
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
    // this.isSubmitting.set(true);
    // data.serviceId = this.serviceToEdit()?.serviceId;
    // this._serviceService.updateService(data).subscribe({
    //   next: () => {
    //     this._messageService.add({
    //       severity: 'success',
    //       summary: 'Éxito',
    //       detail: 'Servicio actualizado correctamente',
    //     });
    //     this.closeModal();
    //   },
    //   error: (response) => {
    //     this._messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: response.error.message || 'Error al actualizar el servicio',
    //     });
    //     this.isSubmitting.set(false);
    //   },
    // });
  }

  closeModal() {
    this.showModal.set(false);
    this.branchForm.reset();
    this.isEditing.set(false);
    this.refreshData.emit();
    this.isSubmitting.set(false);
  }
}
