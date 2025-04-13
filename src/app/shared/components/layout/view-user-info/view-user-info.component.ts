import { Component, inject, model, signal } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Tag } from 'primeng/tag';
import { UserService } from '../../../../core/services/users-services/user.service';

@Component({
  selector: 'app-view-user-info',
  imports: [],
  templateUrl: './view-user-info.component.html',
  styleUrl: './view-user-info.component.scss',
})
export class ViewUserInfoComponent {
  userId = model<string>('');
  userInfo = signal<any>({});
  private readonly _config = inject(DynamicDialogConfig);
  private readonly _userService = inject(UserService);

  ngOnInit() {
    this.userId.set(this._config.data);
    console.log(this.userId());
    this.loadUser(this.userId());
  }

  loadUser(id: string) {
    this._userService.findUserById('34203588').subscribe((res) => {
      this.userInfo.set(res);
    });
  }
}
