import { Component, inject, signal } from '@angular/core';
import { LocalstorageService } from '../core/services/localstorage-services/localstorage.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ListboxModule } from 'primeng/listbox';
import { HeaderComponent } from '../shared/components/layout/header/header.component';
import { SidebarComponent } from '../shared/components/layout/sidebar/sidebar.component';
import { BranchService } from '../core/services/braches-services/branch.service';
import { ModalComponent } from '../shared/components/ui/modal/modal.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '../shared/components/ui/button/button.component';

@Component({
  selector: 'app-main',
  imports: [
    SidebarComponent,
    HeaderComponent,
    RouterOutlet,
    ListboxModule,
    FormsModule,
    ModalComponent,
    ButtonComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  branches = signal<{ address: string; branchId: string }[]>([]);
  selectedBranch = signal(null);
  activeModalSelectBranch = signal<boolean>(false);
  private readonly _localStorageService = inject(LocalstorageService);
  private readonly _branchesService = inject(BranchService);
  branchId = toSignal(this._localStorageService.getBranchId());

  ngOnInit(): void {
    if (this.branchId() == null) {
      this._branchesService.getBranches(1, 20).subscribe((response) => {
        const branchesData = response.data.branches as [];
        this.branches.set(
          branchesData.map((branch: any) => {
            return { address: branch.address, branchId: branch.sucursalId };
          })
        );
      });
      this.activeModalSelectBranch.set(true);
    }
  }

  // Para confirmar la selección
  confirmBranchSelection(): void {
    if (this.selectedBranch() == null) {
      return;
    }
    this.selectedBranch.set(this.selectedBranch());
    this._localStorageService.setBranch(this.selectedBranch());
    this._localStorageService.setBranches(this.branches());
    this.activeModalSelectBranch.set(false);
  }
}
