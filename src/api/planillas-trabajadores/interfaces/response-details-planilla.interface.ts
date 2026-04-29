import { MetodoPago } from "@/interfaces/enums/planillas.enums";

export interface ResponseDetailsPlanilla {
  planilla: Planilla;
  resumen: Resumen;
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
  detalles: Detalle[];
  propietario: Propietario;
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
  metodoPago: null | MetodoPago;
  observaciones: null;
  createdAt: Date;
  updatedAt: Date;
  trabajador: Propietario;
}

export interface Propietario {
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
  propietarioId: null | string;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  profileImages: ProfileImage[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
}

export interface Pais {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
  departamentos?: Departamento[];
}

export interface ProfileImage {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resumen {
  totalTrabajadores: number;
  totalPagados: number;
  totalPendientes: number;
  montoTotalPagado: number;
  montoTotalPendiente: number;
}
