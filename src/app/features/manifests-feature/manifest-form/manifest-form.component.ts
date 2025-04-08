import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { StepperModule } from 'primeng/stepper';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ManifestsService } from '../../../core/services/manifests-services/manifests.service';
import { SkeletonModule } from 'primeng/skeleton';
import { BranchService } from '../../../core/services/braches-services/branch.service';
import { Branch } from '../../branches-feature/interfaces/branch.interface';
import { Step1ManifestFormComponent } from './steps/step1-manifest-form/step1-manifest-form.component';
import { Step2ManifestFormComponent } from './steps/step2-manifest-form/step2-manifest-form.component';

import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Option } from '../../../shared/components/forms/select/select.component';
import { Toast } from 'primeng/toast';

interface SuggestedManifest {
  id: string;
  serviceName: string;
  description: string;
  type: string;
  branch: string;
  branchId: string;
  date: Date;
  sales: any[];
  totalPassengers: number;
  participants: any[];
}

@Component({
  selector: 'app-manifest-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    DividerModule,
    DialogModule,
    TabViewModule,
    StepperModule,
    SkeletonModule,
    Step1ManifestFormComponent,
    Step2ManifestFormComponent,
    Toast,
  ],
  templateUrl: './manifest-form.component.html',
  styleUrl: './manifest-form.component.scss',
  providers: [MessageService],
})
export class ManifestFormComponent {
  // Services using inject pattern
  private readonly manifestsService = inject(ManifestsService);
  private readonly branchService = inject(BranchService);
  private readonly messageService = inject(MessageService);
  private readonly _ref = inject(DynamicDialogRef);
  currentManifestPage = signal<number>(1);
  manifestPageSize = signal<number>(10);
  totalManifestRecords = signal<number>(0);
  // Wizard control
  currentStep = 1;
  steps = [
    { label: 'Seleccionar fecha y sucursales', value: 1 },
    { label: 'Revisar ventas asociadas', value: 2 },
  ];

  // Process variables using signals
  selectedDate = signal<Date>(new Date());
  selectedService = signal<any | null>(null);
  loading = signal<boolean>(false);
  loadingBranches = signal<boolean>(false);
  branches = toSignal<Option[] | undefined>(
    this.branchService.getBranches(1, 50).pipe(
      map((response) =>
        response.data.branches.map((branch: Branch) => ({
          value: branch.sucursalId,
          label: branch.address,
        }))
      )
    )
  );

  selectedBranch = signal<string>('');
  suggestedManifests = signal<SuggestedManifest[] | any>([]);
  selectedManifests = signal<SuggestedManifest[]>([]);

  // Dialog details
  showManifestDetail = signal<boolean>(false);
  selectedManifestDetail = signal<SuggestedManifest | null>(null);
  handlePageChange(event: { currentPage: number; rows: number }): void {
    this.currentManifestPage.set(event.currentPage);
    this.manifestPageSize.set(event.rows);
    this.searchSales((step: number) => {
      this.currentStep = step;
    });
  }
  /**
   * Checks if a specific step can be activated
   */
  canActivateStep(step: number): boolean {
    if (step === 1) return true;
    if (step === 2) return this.suggestedManifests().length > 0;
    return false;
  }

  /**
   * Checks if user can advance to next step
   */
  get canAdvance(): boolean {
    console.log(this.selectedDate(), this.selectedBranch());
    return !!this.selectedDate() && this.selectedBranch() !== null;
  }

  /**
   * Checks if there are any selected manifests
   */
  get hasSelectedManifests(): boolean {
    return this.selectedManifests().length > 0;
  }

  /**
   * Searches for pending sales by date and selected branches
   */
  searchSales(activateCallback: (value: number) => void): void {
    if (!this.selectedDate()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Select a date',
        detail: 'You must select a date to search for pending sales',
      });
      return;
    }

    this.manifestsService
      .recommendManifests(1, 10, [
        {
          value: this.selectedDate().toString(),
          key: 'departureDate',
        },
        {
          value: this.selectedBranch() || '',
          key: 'sucursalId',
        },
        {
          key: 'serviceId',
          value: this.selectedService().serviceId || '',
        },
      ])
      .subscribe({
        next: (response) => {
          const sales = response.data.sales.map((sale: any) => ({
            ...sale,
            id: sale.sucursalId, // Add id property for easier selection
            selected: false,
          }));

          this.suggestedManifests.set(sales);
          this.loading.set(false);
          this.currentStep = 2;
          activateCallback(2);
          this.loading.set(false);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not load sales',
          });
          this.loading.set(false);
        },
      });

    this.loading.set(true);
  }

  /**
   * Returns to date and branch selection step
   */
  goBackToDateSelection(): void {
    this.currentStep = 1;
    this.selectedManifests.set([]);
  }

  /**
   * Shows manifest details
   */
  showManifestDetails(manifest: SuggestedManifest): void {
    this.selectedManifestDetail.set(manifest);
    this.showManifestDetail.set(true);
  }

  /**
   * Generates selected manifests
   */
  generateManifests(): void {
    this.loading.set(true);

    const data = {
      serviceId: this.selectedService().serviceId || '',
      sucursalId: this.selectedBranch() || '',
      serviceType: this.selectedService().type || '',
      date: new Date().toString(),
      title: this.selectedService().name || '',
      description: this.selectedService().description || '',
      registeredBy: '73464945',
      participants: this.suggestedManifests().map((sale: any) => ({
        clientId: sale.client.clientId,
        clientName:
          sale.client.name +
          ' ' +
          sale.client.firstLastname +
          ' ' +
          sale.client.secondLastname,
        saleId: sale.saleId,
        saleDetailId: sale.details[0].detailSaleId,
        comments: sale.observations,
      })),
    };
    this.manifestsService.createManifest(data).subscribe({
      next: (response) => {
        this.selectedManifests.set([]);
        this.loading.set(false);
        const message = response.message || 'Creado con éxito';
        this._ref.close(message);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });

    this.loading.set(true);
  }

  /**
   * Restarts the generation process
   */
  restartProcess(): void {
    this.currentStep = 1;
    this.suggestedManifests.set([]);
    this.selectedManifests.set([]);
    this.selectedDate.set(new Date());
  }

  /**
   * Closes the dialog and returns generated manifests
   */
  closeDialog(): void {
    this._ref.close();
  }
}
