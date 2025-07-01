import {
  Component,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { UserService } from '../../../core/services/users-services/user.service';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RolesService } from '../../../core/services/roles-services/roles.service';
import { ButtonModule } from 'primeng/button';
import { VerifiedRolesService } from '../../../core/services/auth-services/verified-roles.service';
import { FilterEmptyValuesPipe } from '../../../shared/pipes/filter-empty-value.pipe';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
@Component({
  selector: 'app-add-user',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputFormComponent,
    ButtonComponent,
    ModalComponent,
 
    ButtonModule,
    CapitalizePipe,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _userService = inject(UserService);
  private readonly _rolesService = inject(RolesService);
  private readonly _messageService = inject(MessageService); 
  private readonly _verifiedRoles = inject(VerifiedRolesService);
  private readonly _filteredEmpptyValues = inject(FilterEmptyValuesPipe);
  rolesOptions = signal<any[]>([]);
  userForm: FormGroup = this._fb.group({
    numDni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
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
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: [''],
    birthDate: ['', Validators.required],
    password: [],
    photoUrl: ['https://github.com/hearelmer.png'],
    roleId: [''],
    userId: [''],
  });
  showModal = model<boolean>(false);
  rolePreselected = input<string>('');
  refreshData = output<void>();
  isEditing = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  modaltype = signal<string>('');
  userToEdit = input<any>(null);
  isGerent = this._verifiedRoles.isGerent;

  constructor() {
    // Subscribirse a los cambios del DNI para actualizar la contraseña
    this.userForm.get('numDni')?.valueChanges.subscribe((dni) => {
      this.userForm.patchValue({ password: dni }, { emitEvent: false });
    });

    effect(() => {
      if (this.showModal() && this.userToEdit()) {
        this.isEditing.set(true);
        this.userForm.patchValue(this.userToEdit());
        this.loadRolesAndSetSelected();
      }
    });
  }

  searchClientByDni() {
    const dni = this.userForm.get('numDni')?.value;
    if (dni.length === 8) {
      this._userService.searchUserByDni(dni).subscribe({
        next: (response) => {
          this.userForm.patchValue({
            name: response.data.name,
            firstLastname: response.data.firstLastname,
            secondLastname: response.data.secondLastname,
            numDni: response.data.numberDocument,
          });
        },
      });
    }
  }

  private loadRolesAndSetSelected(): void {
    this._rolesService.getRoles().subscribe({
      next: (response) => {
        const roles = response.data.map((role: any) => ({
          value: role.roleId,
          label: role.roleName,
        }));

        this.rolesOptions.set(roles);

        const selectedRole = roles.find(
          (role: any) =>
            role.label.toLowerCase() === this.rolePreselected().toLowerCase()
        );

        if (selectedRole) {
          this.userForm.patchValue({
            roleId: selectedRole.value,
          });
        }
      },
    });
  }

  onSubmit() {
    // Si el formulario no es válido, no procedemos
    if (!this.userForm.valid) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los campos requeridos',
      });
      return;
    }

    // Indicar estado de carga
    this.isLoading.set(true);

    // Limpiar datos del formulario
    const cleanedFormData = this._filteredEmpptyValues.transform(
      this.userForm.value
    );

    // Determinar si es creación o actualización
    if (this.isEditing()) {
      this.updateExistingUser(cleanedFormData);
    } else {
      this.createNewUser(cleanedFormData);
    }
  }

  private createNewUser(userData: any): void {
    const role = this.rolePreselected().toLowerCase();
    let createOperation;

    switch (role) {
      case 'administrador':
        createOperation = this._userService.createUserAsAdmin(userData);
        break;
      case 'gerente':
        createOperation = this._userService.createUserAsGerent(userData);
        break;
      case 'vendedor':
        createOperation = this._userService.createUserAsSeller(userData);
        break;
      default:
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Rol no reconocido',
        });
        this.isLoading.set(false);
        return;
    }

    createOperation.subscribe({
      next: (response) => {
        this.showModal.set(false);
        this.userForm.reset();
        this.refreshData.emit();
        this._messageService.add({
          severity: 'success',
          summary: 'Usuario creado',
          detail: response.message || 'Usuario creado exitosamente',
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo crear el usuario',
        });
        this.isLoading.set(false);
      },
    });
  }

  private updateExistingUser(userData: any): void {
    this._userService.updateUser(userData).subscribe({
      next: (response) => {
        this.showModal.set(false);
        this.userForm.reset();
        this.isEditing.set(false);
        this.refreshData.emit();
        this._messageService.add({
          severity: 'success',
          summary: 'Usuario actualizado',
          detail: response.message,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo actualizar el usuario',
        });
        this.isLoading.set(false);
      },
    });
  }

  closeModal() {
    this.showModal.set(false);
    this.userForm.reset();
    this.isEditing.set(false);
  }
}
