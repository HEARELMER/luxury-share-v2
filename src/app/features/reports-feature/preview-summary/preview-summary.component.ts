import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';

interface SaleItem {
  date: string;
  code: string;
  clientName: string;
  service: string;
  paymentMethod: string;
  amount: number;
}

interface CategorySummary {
  name: string;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-preview-summary', 
  imports: [CommonModule, ChartModule, ButtonModule],
  templateUrl: './preview-summary.component.html',
  styleUrls: ['./preview-summary.component.scss']
})
export class PreviewSummaryComponent implements OnInit {
  // Datos del reporte
  reportTitle = signal('Reporte de Ventas');
  reportPeriod = signal('01/04/2025 - 30/04/2025');
  generationDate = signal('30/04/2025 15:23:05');
  
  // Métricas clave
  totalSales = signal(24650.00);
  growthPercentage = signal(12);
  totalTransactions = signal(143);
  averageTransaction = signal(172.40);
  cashPercentage = signal(65);
  cardPercentage = signal(35);

  // Datos de ventas (muestra)
  saleItems = signal<SaleItem[]>([
    {
      date: '15/04/2025',
      code: 'VTA-24150078',
      clientName: 'María Rodríguez',
      service: 'Tour Ayacucho',
      paymentMethod: 'Efectivo',
      amount: 450.00
    },
    {
      date: '15/04/2025',
      code: 'VTA-24150079',
      clientName: 'Carlos Mendoza',
      service: 'Paquete Selva Central',
      paymentMethod: 'Tarjeta',
      amount: 1250.00
    },
    {
      date: '16/04/2025',
      code: 'VTA-24160034',
      clientName: 'Luis Gómez',
      service: 'Ticket Bus Lima-Cusco',
      paymentMethod: 'Efectivo',
      amount: 180.00
    },
    {
      date: '17/04/2025',
      code: 'VTA-24170012',
      clientName: 'Ana Sánchez',
      service: 'Hotel Cusco - 3 noches',
      paymentMethod: 'Transferencia',
      amount: 890.00
    }
  ]);

  // Datos de categorías
  categories = signal<CategorySummary[]>([
    { name: 'Tours', percentage: 42, color: 'bg-primary-500' },
    { name: 'Paquetes', percentage: 30, color: 'bg-orange-400' },
    { name: 'Tickets', percentage: 15, color: 'bg-green-400' },
    { name: 'Hoteles', percentage: 13, color: 'bg-blue-400' }
  ]);

  // Calcular el total mostrado en la muestra
  get sampleTotal(): number {
    return this.saleItems().reduce((sum, item) => sum + item.amount, 0);
  }

  ngOnInit(): void {
    // Aquí podrías cargar datos reales desde un servicio
  }

  getPaymentMethodClass(method: string): string {
    switch (method.toLowerCase()) {
      case 'efectivo':
        return 'bg-green-100 text-green-800';
      case 'tarjeta':
        return 'bg-blue-100 text-blue-800';
      case 'transferencia':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  downloadAsPdf(): void {
    // Lógica para descargar como PDF
    console.log('Descargando como PDF...');
  }

  printReport(): void {
    // Lógica para imprimir
    window.print();
  }
}