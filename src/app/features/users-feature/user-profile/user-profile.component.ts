import { Component, computed, inject, signal } from '@angular/core';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { PhotoProfileComponent } from '../../../shared/components/layout/photo-profile/photo-profile.component';
import { TabsModule } from 'primeng/tabs';
import { USER_PROFILE_CONFIG } from '../constants/user.profile-config.constant';
import { PasswordRecoveryComponent } from '../../auth-feature/password-recovery/password-recovery.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../core/services/users-services/user.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { InputFileComponent } from '../../../shared/components/forms/input-file/input-file.component';
import { CloudStorageService } from '../../../core/services/cloud-storage/cloud-storage.service';
@Component({
  selector: 'app-user-profile',
  imports: [
    ButtonComponent,
    InputFormComponent,
    PhotoProfileComponent,
    TabsModule,
    PasswordRecoveryComponent,
    ReactiveFormsModule,
    FormsModule,
    Toast,
    ModalComponent,
    InputFileComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private localStorageService = inject(LocalstorageService);
  private readonly _messageService = inject(MessageService);
  private readonly _userService = inject(UserService);
  private readonly _fb = inject(FormBuilder);
  private readonly _cloudStorageService = inject(CloudStorageService);
  photoPreviewModal = signal<boolean>(false);
  fileSelected = signal<File | null>(null);
  previewImageUrl = computed(() => {
    const file = this.fileSelected();
    if (file) {
      return URL.createObjectURL(file);
    }
    return null;
  });
  userInfo = signal<any>(null);
  menuOptions = USER_PROFILE_CONFIG;
  loading = signal<boolean>(false);

  userProfile = this._fb.group({
    name: ['', [Validators.minLength(3), Validators.required]],
    firstLastname: ['', [Validators.minLength(3), Validators.required]],
    secondLastname: ['', [Validators.minLength(3), Validators.required]],
    phone: ['', [Validators.minLength(8), Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    address: ['', [Validators.minLength(3), Validators.required]],
    birthDate: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.userInfo.set(this.localStorageService.getUserAuthorized());
    this.userProfile.patchValue(this.userInfo());
  }

  viewPasswordRecoveryForm = signal<boolean>(false);
  OpenpasswordRecovery() {
    this.viewPasswordRecoveryForm.set(true);
  }

  onSubmit() {
    this.loading.set(true);
    if (this.userProfile.valid) {
      const userId = this.userInfo().userId;
      this._userService
        .updateProfile(this.userProfile.value, userId)
        .subscribe({
          next: (response) => {
            this.userInfo.set(response.data);
            this._messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: response.message,
            });
            this.localStorageService.setUserAuthorized(response.data);
            this.loading.set(false);
          },
          error: (error) => {
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
            this.loading.set(false);
          },
          complete: () => {
            this.loading.set(false);
          }
        });
    }
  }

  // Modificar el método onFileSelected
  onFileSelected(event: File | File[]) {
    let file: File | null = null;

    if (event instanceof File) {
      file = event;
    } else if (Array.isArray(event) && event.length > 0) {
      file = event[0];
    }

    if (file) {
      this.fileSelected.set(file);
      this.photoPreviewModal.set(true);
    }
  }

  uploadImage() {
    let uploadedFileUrl: string = '';
    if (this.fileSelected()) {
      this.photoPreviewModal.set(false);
      this._messageService.add({
        severity: 'info',
        detail: 'Subiendo imagen...',
      });
      this._cloudStorageService
        .uploadFile('profiles', this.fileSelected() as File)
        .subscribe({
          next: (response) => {
            uploadedFileUrl = response.url;
          },
          complete: () => {
            const userId = this.userInfo().userId;
            this._userService
              .updateProfile(
                { ...this.userProfile.value, photoUrl: uploadedFileUrl },
                userId
              )
              .subscribe({
                next: (response) => {
                  this.userInfo.set(response.data);
                  this._messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: response.message,
                  });

                  this.localStorageService.setUserAuthorized(response.data);
                },
              });
          },
        });
    }
  }
}
