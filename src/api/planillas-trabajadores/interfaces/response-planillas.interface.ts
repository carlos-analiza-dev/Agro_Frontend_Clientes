export interface ResponsePlanillaInterface {
  planillas: Planilla[];
  total: number;
  limit: number;
  offset: number;
}

export interface Planilla {
  id: string;
  nombre: string;
  descripcion: string;
  tipoPeriodo: string;
  diasPeriodo: number;
  fechaInicio: string;
  fechaFin: string;
  fechaPago: string;
  estado: string;
  totalSalarios: string;
  totalHorasExtras: string;
  totalBonificaciones: string;
  totalDeducciones: string;
  totalNeto: string;
  observaciones: null;
  propietarioId: string;
  createdAt: Date;
  updatedAt: Date;
  detalles: Detalle[] | any[];
}

export interface Detalle {
  id: string;
  planillaId: string;
  trabajadorId: string;
  salarioDiario: string;
  valorHoraExtraDiurna: string;
  valorHoraExtraNocturna: string;
  valorHoraExtraFestiva: string;
  diasTrabajados: number;
  diasDescanso: number;
  diasVacaciones: number;
  diasEnfermedad: number;
  diasPermiso: number;
  ausenciasInjustificadas: number;
  horasExtraDiurnas: string;
  horasExtraNocturnas: string;
  horasExtraFestivas: string;
  totalHorasExtras: string;
  bonificaciones: string;
  desgloseBonificaciones: null;
  deducciones: string;
  desgloseDeducciones: null;
  prestamos: string;
  desglosePrestamos: null;
  salarioBase: string;
  totalDevengado: string;
  totalDeduccionesAplicadas: string;
  totalAPagar: string;
  pagado: boolean;
  fechaPago: null;
  metodoPago: null;
  observaciones: null;
  createdAt: Date;
  updatedAt: Date;
  trabajador: Trabajador;
}

export interface Trabajador {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  verified: boolean;
  rol: string;
  isActive: boolean;
  createdAt: Date;
  propietarioId: string;
}
