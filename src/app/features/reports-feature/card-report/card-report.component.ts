import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-card-report',
  imports: [],
  templateUrl: './card-report.component.html',
  styleUrl: './card-report.component.scss',
})
export class CardReportComponent {
  title = input.required<string>();
  icon = input.required<string>();
  description = input<string>('');
  loading = input<boolean>(false);
  details = input<any>([]);
  borderColor = input<string>('border-gray-300');
  onPdf = output<void>();
  onExcel = output<void>();

  onPdfClick(): void {
    console.log('PDF button clicked');
    this.onPdf.emit();
  }

  onExcelClick(): void {
    console.log('Excel button clicked');
    this.onExcel.emit();
  }
}
