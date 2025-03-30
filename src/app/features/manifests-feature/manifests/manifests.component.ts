import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

interface Manifiesto {
  id: string;
  nombreServicio: string;
  tipoServicio: 'tour' | 'hotel' | 'comida' | 'transporte' | 'paquete';
  fechaServicio: Date;
  destino: string;
  lugarSalida?: string;
  guia?: string;
  guiaFoto?: string;
  capacidadMaxima: number;
  pasajerosConfirmados: number;
  checkInCompletos?: number;
  estado: 'programado' | 'en_progreso' | 'completado' | 'cancelado';
  pasajeros?: Pasajero[];
}

interface Pasajero {
  id: string;
  nombreCompleto: string;
  tipoDocumento: string;
  documento: string;
  nacionalidad?: string;
  restriccionesAlimenticias?: string;
  checkIn: boolean;
}

interface Filtros {
  tipoServicio: any;
  fecha: Date | null;
  estado: any;
}

@Component({
  selector: 'app-manifests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    SelectButtonModule,
    TagModule,
    DialogModule,
    InputSwitchModule,
    ProgressBarModule,
    ToastModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './manifests.component.html',
  styleUrl: './manifests.component.scss'
})
export class ManifestsComponent implements OnInit {
  // Datos para los filtros
  tiposServicio = [
    { label: 'Todos', value: null },
    { label: 'Tours', value: 'tour' },
    { label: 'Hoteles', value: 'hotel' },
    { label: 'Comidas', value: 'comida' },
    { label: 'Paquetes', value: 'paquete' }
  ];

  estadosManifiesto = [
    { label: 'Todos', value: null },
    { label: 'Programados', value: 'programado' },
    { label: 'En progreso', value: 'en_progreso' },
    { label: 'Completados', value: 'completado' },
    { label: 'Cancelados', value: 'cancelado' }
  ];

  // Estado del componente
  manifiestos: Manifiesto[] = [];
  manifiestoSeleccionado: Manifiesto | null = null;
  mostrarDetalle: boolean = false;
  cargando: boolean = false;
  filtros: Filtros = {
    tipoServicio: null,
    fecha: null,
    estado: null
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.cargarDatosEjemplo();
    this.buscarManifiestos();
  }

  cargarDatosEjemplo(): void {
    // Datos de ejemplo para la demostración
    this.manifiestos = [
      {
        id: '1',
        nombreServicio: 'Tour Valle Sagrado',
        tipoServicio: 'tour',
        fechaServicio: new Date('2025-04-15T08:30:00'),
        destino: 'Valle Sagrado, Cusco',
        lugarSalida: 'Plaza de Armas',
        guia: 'Carlos Mendoza',
        guiaFoto: 'https://randomuser.me/api/portraits/men/32.jpg',
        capacidadMaxima: 20,
        pasajerosConfirmados: 14,
        checkInCompletos: 0,
        estado: 'programado',
        pasajeros: this.generarPasajerosFicticios(14)
      },
      {
        id: '2',
        nombreServicio: 'Hotel Palacio del Inka',
        tipoServicio: 'hotel',
        fechaServicio: new Date('2025-04-16T14:00:00'),
        destino: 'Cusco Centro',
        capacidadMaxima: 50,
        pasajerosConfirmados: 35,
        checkInCompletos: 12,
        estado: 'en_progreso',
        pasajeros: this.generarPasajerosFicticios(35, 12)
      },
      {
        id: '3',
        nombreServicio: 'Almuerzo Pachamanca',
        tipoServicio: 'comida',
        fechaServicio: new Date('2025-04-10T12:30:00'),
        destino: 'Restaurante El Huacatay',
        guia: 'Ana Castro',
        guiaFoto: 'https://randomuser.me/api/portraits/women/44.jpg',
        capacidadMaxima: 30,
        pasajerosConfirmados: 30,
        checkInCompletos: 30,
        estado: 'completado',
        pasajeros: this.generarPasajerosFicticios(30, 30)
      },
      {
        id: '4',
        nombreServicio: 'Paquete Machu Picchu 3D/2N',
        tipoServicio: 'paquete',
        fechaServicio: new Date('2025-04-20T05:00:00'),
        destino: 'Machu Picchu',
        lugarSalida: 'Hotel Los Andes',
        guia: 'Roberto Sánchez',
        capacidadMaxima: 15,
        pasajerosConfirmados: 8,
        checkInCompletos: 0,
        estado: 'programado',
        pasajeros: this.generarPasajerosFicticios(8)
      },
      {
        id: '5',
        nombreServicio: 'Tour nocturno Cusco',
        tipoServicio: 'tour',
        fechaServicio: new Date('2025-04-18T19:00:00'),
        destino: 'Centro histórico Cusco',
        lugarSalida: 'Plaza San Francisco',
        guia: 'Luis Torres',
        capacidadMaxima: 15,
        pasajerosConfirmados: 10,
        checkInCompletos: 0,
        estado: 'programado',
        pasajeros: this.generarPasajerosFicticios(10)
      }
    ];
  }

  // Método para simular generación de pasajeros aleatorios
  generarPasajerosFicticios(cantidad: number, checkins: number = 0): Pasajero[] {
    const nombres = ['Carlos Pérez', 'Ana García', 'Juan Silva', 'María López', 'Pedro Rojas', 
                    'Lucía Torres', 'Roberto Mendoza', 'Julia Ortiz', 'Luis Castro', 'Carmen Rivas'];
    const tipos = ['DNI', 'Pasaporte', 'CE'];
    const nacionalidades = ['Perú', 'Argentina', 'Chile', 'Colombia', 'México', 'España', 'EEUU', 'Brasil'];
    const restricciones = ['Vegetariano', 'Vegano', 'Sin gluten', 'Sin lactosa', 'Alergia a mariscos', null, null, null];
    
    const pasajeros: Pasajero[] = [];
    
    for (let i = 0; i < cantidad; i++) {
      const nombre = nombres[Math.floor(Math.random() * nombres.length)];
      const tipoDoc = tipos[Math.floor(Math.random() * tipos.length)];
      const nacionalidad = nacionalidades[Math.floor(Math.random() * nacionalidades.length)];
      const restriccion = restricciones[Math.floor(Math.random() * restricciones.length)];
      
      pasajeros.push({
        id: `p${i+1}`,
        nombreCompleto: nombre,
        tipoDocumento: tipoDoc,
        documento: this.generarDocumentoAleatorio(tipoDoc),
        nacionalidad,
        restriccionesAlimenticias: restriccion as string,
        checkIn: i < checkins // Marcamos como check-in solo la cantidad indicada
      });
    }
    
    return pasajeros;
  }
  
  generarDocumentoAleatorio(tipo: string): string {
    if (tipo === 'DNI') {
      return `${Math.floor(10000000 + Math.random() * 90000000)}`;
    } else if (tipo === 'Pasaporte') {
      const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const letra1 = letras[Math.floor(Math.random() * letras.length)];
      const letra2 = letras[Math.floor(Math.random() * letras.length)];
      return `${letra1}${letra2}${Math.floor(1000000 + Math.random() * 9000000)}`;
    } else {
      return `${Math.floor(100000 + Math.random() * 900000)}`;
    }
  }

  buscarManifiestos(): void {
    this.cargando = true;
    
    // Aquí iría tu llamada a API real
    setTimeout(() => {
      // Filtrado local para la demostración
      let resultados = [...this.manifiestos];
      
      if (this.filtros.tipoServicio) {
        resultados = resultados.filter(m => m.tipoServicio === this.filtros.tipoServicio);
      }
      
      if (this.filtros.fecha) {
        const fechaSeleccionada = new Date(this.filtros.fecha);
        resultados = resultados.filter(m => {
          const fechaManifiesto = new Date(m.fechaServicio);
          return fechaManifiesto.getDate() === fechaSeleccionada.getDate() &&
                 fechaManifiesto.getMonth() === fechaSeleccionada.getMonth() &&
                 fechaManifiesto.getFullYear() === fechaSeleccionada.getFullYear();
        });
      }
      
      if (this.filtros.estado) {
        resultados = resultados.filter(m => m.estado === this.filtros.estado);
      }
      
      this.manifiestos = resultados;
      this.cargando = false;
    }, 500);
  }

  limpiarFiltros(): void {
    this.filtros = {
      tipoServicio: null,
      fecha: null,
      estado: null
    };
    this.buscarManifiestos();
  }

  verDetalle(id: string): void {
    this.manifiestoSeleccionado = this.manifiestos.find(m => m.id === id) || null;
    this.mostrarDetalle = true;
  }

  imprimirManifiesto(id: string): void {
    // Implementación de impresión
    this.messageService.add({
      severity: 'info',
      summary: 'Imprimir',
      detail: `Se está preparando la impresión del manifiesto #${id}`
    });
  }

  editarManifiesto(id: string): void {
    // Implementación para editar
    this.messageService.add({
      severity: 'info',
      summary: 'Editar',
      detail: `Editando manifiesto #${id}`
    });
  }

  crearManifiesto(): void {
    // Implementación para crear nuevo
    this.messageService.add({
      severity: 'info',
      summary: 'Nuevo',
      detail: 'Creando nuevo manifiesto'
    });
  }

  actualizarCheckIn(pasajero: Pasajero): void {
    // Aquí implementarías la llamada a la API para actualizar el check-in
    const mensaje = pasajero.checkIn ? 'Check-in completado' : 'Check-in cancelado';
    this.messageService.add({
      severity: 'success',
      summary: 'Check-in',
      detail: `${mensaje} para ${pasajero.nombreCompleto}`
    });
    
    // Actualizar contador de check-ins en el manifiesto
    if (this.manifiestoSeleccionado) {
      this.manifiestoSeleccionado.checkInCompletos = this.manifiestoSeleccionado.pasajeros?.filter(p => p.checkIn)?.length || 0;
    }
  }

  editarPasajero(pasajero: Pasajero): void {
    // Implementación para editar
    this.messageService.add({
      severity: 'info',
      summary: 'Editar Pasajero',
      detail: `Editando datos de ${pasajero.nombreCompleto}`
    });
  }

  eliminarPasajero(pasajero: Pasajero): void {
    // Implementación para eliminar
    this.messageService.add({
      severity: 'warn',
      summary: 'Eliminar Pasajero',
      detail: `¿Desea eliminar a ${pasajero.nombreCompleto} del manifiesto?`
    });
  }

  getEstadoLabel(estado: string): string {
    const labels: {[key: string]: string} = {
      'programado': 'Programado',
      'en_progreso': 'En progreso',
      'completado': 'Completado',
      'cancelado': 'Cancelado'
    };
    return labels[estado] || estado;
  }

  getEstadoSeverity(estado: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    const severities: {[key: string]: string} = {
      'programado': 'info',
      'en_progreso': 'warn',
      'completado': 'success',
      'cancelado': 'danger'
    };
    return severities[estado] as any || 'info';
  }

  getCheckInPorcentaje(manifiesto: Manifiesto): number {
    if (!manifiesto.pasajerosConfirmados || manifiesto.pasajerosConfirmados === 0) {
      return 0;
    }
    return Math.round((manifiesto.checkInCompletos || 0) * 100 / manifiesto.pasajerosConfirmados);
  }
}