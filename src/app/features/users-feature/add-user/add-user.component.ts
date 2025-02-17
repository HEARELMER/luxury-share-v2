import { Component, inject, model } from '@angular/core';
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
import { UserService } from '../../../core/services/user.service';
import { RolesService } from '../../../core/services/roles.service';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';

@Component({
  selector: 'app-add-user',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputFormComponent,
    ButtonComponent,
    ModalComponent,
    SelectComponent,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _userService = inject(UserService);
  private readonly _rolesService = inject(RolesService);

  rolesOptions: any = '';

  ngOnInit(): void {
    this._rolesService.getRoles().subscribe({
      next: (response) => {
        this.rolesOptions = response.data.map((role: any) => ({
          value: role.roleId,
          label: role.roleName,
        }));
      },
    });
  }

  userForm: FormGroup = this._fb.group({
    numDni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    name: ['', Validators.required],
    firstLastname: ['', Validators.required],
    secondLastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
    birthDate: ['', Validators.required],
    password: [],
    photoUrl: ['https://github.com/hearelmer.png'],
    roleId: ['', Validators.required],
  });

  showModal = model<boolean>(false);

  constructor() {
    // Subscribirse a los cambios del DNI para actualizar la contraseña
    this.userForm.get('numDni')?.valueChanges.subscribe((dni) => {
      this.userForm.patchValue({ password: dni }, { emitEvent: false });
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this._userService.createUser(this.userForm.value).subscribe(() => {
        this.showModal.set(false);
        this.userForm.reset();
      });
    }
  }
}
