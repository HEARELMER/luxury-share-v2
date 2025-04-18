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

import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RolesService } from '../../../core/services/roles-services/roles.service';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
@Component({
  selector: 'app-add-user',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputFormComponent,
    ButtonComponent,
    ModalComponent,
    SelectComponent,
    ToastModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _userService = inject(UserService);
  private readonly _rolesService = inject(RolesService);
  private readonly _messageService = inject(MessageService);
  private readonly _localStorageService = inject(LocalstorageService);
  rolesOptions = signal<any[]>([]);
  userForm: FormGroup = this._fb.group({
    numDni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    name: ['', Validators.required],
    firstLastname: ['', Validators.required],
    secondLastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: [''],
    birthDate: [''],
    password: [],
    photoUrl: ['https://github.com/hearelmer.png'],
    roleId: ['', Validators.required],
    userId: [this._localStorageService.getUserId()],
  });
  showModal = model<boolean>(false);
  rolePreselected = input<string>('');
  refreshData = output<void>();
  isEditing = signal<boolean>(false);
  userToEdit = input<any>(null);

  constructor() {
    // Subscribirse a los cambios del DNI para actualizar la contraseña
    this.userForm.get('numDni')?.valueChanges.subscribe((dni) => {
      this.userForm.patchValue({ password: dni }, { emitEvent: false });
    });

    effect(() => {
      if (this.showModal() && this.rolePreselected() && !this.userToEdit()) {
        this.loadRolesAndSetSelected();
      } else if (this.showModal() && this.userToEdit()) {
        this.isEditing.set(true);
        this.userForm.patchValue(this.userToEdit());
        this.loadRolesAndSetSelected();
        console.log(this.userToEdit());
      }
    });
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
    if (this.userForm.valid) {
      const formValues = this.userForm.value;
      const cleanedFormData = Object.entries(formValues).reduce(
        (acc, [key, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );
      if (!this.isEditing()) {
        this._userService.createUser(cleanedFormData).subscribe({
          next: (response) => {
            this.showModal.set(false);
            this.userForm.reset();
            this.refreshData.emit();
            this._messageService.add({
              severity: 'success',
              summary: 'Usuario creado',
              detail: response.message,
            });
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
          },
        });
      } else {
        this._userService.updateUser(cleanedFormData).subscribe({
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
          },
          error: (error) => {
            console.error('Error al actualizar usuario:', error);
          },
        });
      }
    }
  }

  closeModal() {
    this.showModal.set(false);
    this.userForm.reset();
    this.isEditing.set(false);
  }
}
