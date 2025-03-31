import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { StepperModule } from 'primeng/stepper';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ManifestsService } from '../../../core/services/manifests-services/manifests.service';
import { SkeletonModule } from 'primeng/skeleton';
import { BranchService } from '../../../core/services/braches-services/branch.service';
import { Branch } from '../../branches-feature/interfaces/branch.interface';
import { Step1ManifestFormComponent } from './steps/step1-manifest-form/step1-manifest-form.component';
import { Step2ManifestFormComponent } from "./steps/step2-manifest-form/step2-manifest-form.component";
import { Step3ManifestFormComponent } from "./steps/step3-manifest-form/step3-manifest-form.component";

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
  passengers: any[];
}

interface BranchForSelection extends Branch {
  selected?: boolean;
}

@Component({
  selector: 'app-manifest-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePicker,
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
    Step3ManifestFormComponent
],
  templateUrl: './manifest-form.component.html',
  styleUrl: './manifest-form.component.scss',
  providers: [MessageService],
})
export class ManifestFormComponent implements OnInit {
  // Services using inject pattern
  private readonly manifestsService = inject(ManifestsService);
  private readonly branchService = inject(BranchService);
  private readonly messageService = inject(MessageService);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig);

  // Wizard control
  currentStep = 1;
  steps = [
    { label: 'Seleccionar fecha y sucursales', value: 1 },
    { label: 'Revisar sugerencias', value: 2 },
    { label: 'Confirmar creación', value: 3 },
  ];

  // Process variables using signals
  selectedDate = signal<Date>(new Date());
  loading = signal<boolean>(false);
  loadingBranches = signal<boolean>(false);
  branches = signal<BranchForSelection[]>([]);
  selectedBranches = signal<BranchForSelection[]>([]);
  suggestedManifests = signal<SuggestedManifest[]>([]);
  selectedManifests = signal<SuggestedManifest[]>([]);
  generatedManifests = signal<any[]>([]);

  // Dialog details
  showManifestDetail = signal<boolean>(false);
  selectedManifestDetail = signal<SuggestedManifest | null>(null);

  ngOnInit(): void {
    this.loadBranches();
  }

  /**
   * Loads available branches
   */
  loadBranches(): void {
    this.loadingBranches.set(true);

    this.branchService.getBranches(1, 50).subscribe({
      next: (response) => {
        const mappedBranches = response.data.branches.map((branch: Branch) => ({
          ...branch,
          id: branch.sucursalId, // Add id property for easier selection
          selected: false,
        }));

        this.branches.set(mappedBranches);
        this.loadingBranches.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load branches',
        });
        this.loadingBranches.set(false);
      },
    });
  }

  /**
   * Checks if a specific step can be activated
   */
  canActivateStep(step: number): boolean {
    if (step === 1) return true;
    if (step === 2) return this.suggestedManifests().length > 0;
    if (step === 3) return this.generatedManifests().length > 0;
    return false;
  }

  /**
   * Checks if user can advance to next step
   */
  get canAdvance(): boolean {
    return !!this.selectedDate() && this.selectedBranches().length > 0;
  }

  /**
   * Checks if there are any selected manifests
   */
  get hasSelectedManifests(): boolean {
    return this.selectedManifests().length > 0;
  }

  /**
   * Updates selected branches when selection changes
   */
  onBranchSelectionChange(event: any): void {
    this.selectedBranches.set(event || []);
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

    if (this.selectedBranches().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Select at least one branch',
        detail: 'You must select at least one branch to search for sales',
      });
      return;
    }

    this.loading.set(true);

    // Build API parameters
    const params = {
      date: this.selectedDate().toISOString().split('T')[0],
      branchIds: this.selectedBranches()
        .map((s) => s.sucursalId)
        .join(','),
    };

    // Simulate API call - would be replaced with real API call:
    // this.manifestsService.getSuggestedManifests(params).subscribe({...})
    setTimeout(() => {
      // Generate example data based on selected branches
      const suggestions: SuggestedManifest[] = [];

      // For each selected branch, generate 1-3 suggested manifests
      this.selectedBranches().forEach((branch) => {
        const manifestsCount = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < manifestsCount; i++) {
          const serviceType = ['tour', 'hotel', 'transport', 'food'][
            Math.floor(Math.random() * 4)
          ];
          const serviceName = this.getServiceName(serviceType);

          const manifest: SuggestedManifest = {
            id: crypto.randomUUID().substring(0, 8),
            serviceName,
            description: `Description for ${serviceName} in ${branch.name}`,
            type: serviceType,
            branch: branch.name,
            branchId: branch.sucursalId,
            date: new Date(this.selectedDate().getTime()),
            sales: this.generateSampleSales(2 + Math.floor(Math.random() * 3)),
            totalPassengers: 0,
            passengers: [],
          };

          // Generate passengers for sales
          manifest.sales.forEach((sale) => {
            const passengersCount = 1 + Math.floor(Math.random() * 3);
            for (let j = 0; j < passengersCount; j++) {
              manifest.passengers.push(this.generateSamplePassenger(sale.code));
              manifest.totalPassengers++;
            }
          });

          suggestions.push(manifest);
        }
      });

      this.suggestedManifests.set(suggestions);
      this.loading.set(false);

      if (suggestions.length > 0) {
        // Advance to next step if there are suggestions
        activateCallback(2);
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'No results',
          detail: 'No pending sales found for the selected branches and date',
        });
      }
    }, 1200);
  }

  /**
   * Generates a sample passenger for a sale
   */
  private generateSamplePassenger(saleCode: string) {
    const firstNames = ['John', 'Mary', 'Peter', 'Anne', 'Charles', 'Laura'];
    const lastNames = [
      'Garcia',
      'Smith',
      'Lopez',
      'Rodriguez',
      'Johnson',
      'Brown',
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return {
      fullName: `${firstName} ${lastName}`,
      documentType: Math.random() > 0.3 ? 'ID' : 'Passport',
      documentNumber: Math.floor(
        Math.random() * 90000000 + 10000000
      ).toString(),
      saleCode,
      phone:
        Math.random() > 0.5
          ? `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`
          : undefined,
      email:
        Math.random() > 0.5
          ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`
          : undefined,
      nationality:
        Math.random() > 0.7
          ? ['USA', 'Mexico', 'Canada', 'Spain', 'UK'][
              Math.floor(Math.random() * 5)
            ]
          : undefined,
    };
  }

  /**
   * Generates sample sales
   */
  private generateSampleSales(count: number) {
    const sales = [];
    const statuses = ['PENDING', 'IN_PROGRESS'];
    const clients = [
      'John Smith',
      'Mary Jones',
      'Robert Brown',
      'Carla Garcia',
      'Luis Rodriguez',
    ];

    for (let i = 0; i < count; i++) {
      sales.push({
        code: Math.floor(Math.random() * 9000 + 1000).toString(),
        client: clients[Math.floor(Math.random() * clients.length)],
        saleDate: new Date(
          Date.now() - Math.floor(Math.random() * 10 * 86400000)
        ),
        total: Math.floor(Math.random() * 900 + 100),
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }

    return sales;
  }

  /**
   * Generates a service name based on type
   */
  private getServiceName(type: string): string {
    switch (type) {
      case 'tour':
        return [
          'Historic Center Tour',
          'Sacred Valley Tour',
          'City Tour',
          'Food Tour',
        ][Math.floor(Math.random() * 4)];
      case 'hotel':
        return [
          'Marriott Hotel',
          'Sheraton Hotel',
          'Paradise Resort',
          'San Agustin Hotel',
        ][Math.floor(Math.random() * 4)];
      case 'transport':
        return [
          'Airport Transfer',
          'Hotel Transfer',
          'Shuttle Express',
          'Premium Transport',
        ][Math.floor(Math.random() * 4)];
      case 'food':
        return [
          'Tourist Lunch',
          'Gourmet Dinner',
          'International Buffet',
          'Typical Restaurant',
        ][Math.floor(Math.random() * 4)];
      default:
        return 'Tourist Service';
    }
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
  generateManifests(activateCallback: (value: number) => void): void {
    if (!this.hasSelectedManifests) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Select manifests',
        detail: 'You must select at least one manifest to generate',
      });
      return;
    }

    this.loading.set(true);

    // Simulate API call
    setTimeout(() => {
      const generated = this.selectedManifests().map((m) => ({
        ...m,
        manifestId: crypto.randomUUID(),
      }));

      this.generatedManifests.set(generated);
      this.loading.set(false);
      activateCallback(3); // Advance to confirmation step

      this.messageService.add({
        severity: 'success',
        summary: 'Manifests created',
        detail: `${generated.length} manifests were successfully created`,
      });
    }, 1500);
  }

  /**
   * Restarts the generation process
   */
  restartProcess(): void {
    this.currentStep = 1;
    this.suggestedManifests.set([]);
    this.selectedManifests.set([]);
    this.generatedManifests.set([]);
    this.selectedDate.set(new Date());
    this.selectedBranches.set([]);

    // Reset selection in table
    this.branches.update((branches) =>
      branches.map((b) => ({ ...b, selected: false }))
    );
  }

  /**
   * Closes the dialog and returns generated manifests
   */
  closeDialog(): void {
    if (this.generatedManifests().length > 0) {
      this.dialogRef.close({
        createdManifests: this.generatedManifests(),
      });
    } else {
      this.dialogRef.close();
    }
  }

  /**
   * Defines severity color based on status
   */
  getStatusSeverity(status: string): 'info' | 'warn' | 'success' | 'danger' {
    const severities: {
      [key: string]: 'info' | 'warn' | 'success' | 'danger';
    } = {
      PENDING: 'info',
      IN_PROGRESS: 'warn',
      COMPLETED: 'success',
      CANCELLED: 'danger',
    };
    return severities[status] || 'info';
  }
}
