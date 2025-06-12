import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BranchService } from '../../../core/services/braches-services/branch.service';
interface Branch {
  address: string;
  branchId: string;
}
@Component({
  selector: 'app-my-branch',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule, 
  ],
  templateUrl: './my-branch.component.html',
  styleUrl: './my-branch.component.scss',
})
export class MyBranchComponent {
  branches = signal<Branch[]>([]);
  private readonly _localStorageService = inject(LocalstorageService);
  private readonly _branchesService = inject(BranchService);
  branchId = toSignal(this._localStorageService.getBranchId());
  selectedBranch = signal<Branch>({} as Branch); 
  
    ngOnInit(): void {  
    if (this.branchId() == null) {
      // Si no hay branchId seleccionado, cargamos todas las sucursales
      this._branchesService.getBranches(1, 20).subscribe((response) => {
        const branchesData = response.data.branches as [];
        const mappedBranches = branchesData.map((branch: any) => {
          return { address: branch.address, branchId: branch.sucursalId };
        });
        
        this.branches.set(mappedBranches);
      }); 
    } else {
      // Si hay un branchId seleccionado, cargamos las sucursales y destacamos la seleccionada
      this._localStorageService.getBranches().subscribe((branches) => {
        if (branches) { 
          const mappedBranches = branches.map((branch: Branch) => {
            return { address: branch.address, branchId: branch.branchId };
          });
          
          this.branches.set(mappedBranches);
          
          // Encontrar y establecer la sucursal seleccionada basada en branchId
          const currentBranch = mappedBranches.find((branch:any) => branch.branchId === this.branchId());
          if (currentBranch) {
            this.selectedBranch.set(currentBranch);
          }
        }
      });
    }
  }
  

  selectBranch(branch: Branch): void { 
    if (branch === null) return;
    this.selectedBranch.set(branch);
    this._localStorageService.setBranch(branch);
  }
}
