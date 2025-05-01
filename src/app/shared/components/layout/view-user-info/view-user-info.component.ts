import { Component, inject, model, signal } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Tag } from 'primeng/tag';
import { UserService } from '../../../../core/services/users-services/user.service';
import { Skeleton } from 'primeng/skeleton';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-view-user-info',
  imports: [Skeleton, Tag, CapitalizePipe,NgClass],
  templateUrl: './view-user-info.component.html',
  styleUrl: './view-user-info.component.scss',
})
export class ViewUserInfoComponent {
  userId = signal<string>('');
  userInfo = signal<any>({});
  private readonly _config = inject(DynamicDialogConfig);
  private readonly _userService = inject(UserService);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.userId.set(this._config.data);
    this.loadUser(this.userId());
  }

  loadUser(id: string) {
    this.loading.set(true);
    this._userService.findUserById(id).subscribe({
      next: (data) => {
        this.userInfo.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
      },
    });
  }
}
