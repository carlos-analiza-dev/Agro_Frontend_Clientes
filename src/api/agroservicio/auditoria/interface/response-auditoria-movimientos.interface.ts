export interface ResponseMovimientosAuditoriaLotes {
  total: number;
  limit: number;
  offset: number;
  data: AuditoriaMovimientos[];
}

export interface AuditoriaMovimientos {
  id: string;
  accion: AccionMovimiento;
  fecha: Date;
  movimiento: Movimiento;
  empleado: Empleado;
}

export interface Empleado {
  id: string;
  nombre: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
}

export interface Movimiento {
  id: string;
  tipo: string;
  cantidad: string;
  lote: Lote;
}

export interface Lote {
  id: string;
}

export enum AccionMovimiento {
  CREAR = "MOVIMIENTO REALIZADO",
}
