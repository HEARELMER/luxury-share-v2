
```js
// Programación de servicio
interface ProgramacionServicio {
  id: string;
  tipoServicio: 'tour' | 'hotel' | 'comida' | 'transporte' | 'paquete';
  nombreServicio: string;
  fechaInicio: Date;
  fechaFin: Date;
  lugarPartida?: string;
  destino: string;
  capacidadMaxima: number;
  guia?: string;
  estado: 'programado' | 'en_progreso' | 'completado' | 'cancelado';
}

// Detalle de pasajero en manifiesto
interface PasajeroManifiesto {
  ventaId: string;
  clienteId: string;
  nombreCompleto: string;
  documento: string;
  tipoDocumento: string;
  nacionalidad?: string;
  edad?: number;
  restriccionesAlimenticias?: string;
  necesidadesEspeciales?: string;
  contactoEmergencia?: string;
  checkIn: boolean;
  notasAdicionales?: string;
}

// Manifiesto completo
interface Manifiesto {
  id: string;
  programacionId: string;
  fecha: Date;
  totalPasajeros: number;
  pasajeros: PasajeroManifiesto[];
  estado: 'borrador' | 'confirmado' | 'ejecutado' | 'cerrado';
  generadoPor: string;
  fechaGeneracion: Date;
}
```