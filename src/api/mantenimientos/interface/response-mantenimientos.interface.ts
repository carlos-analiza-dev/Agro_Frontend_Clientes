import { TipoMantenimiento } from "@/interfaces/enums/maquinaria/maquinaria.enums";

export interface ResponseMantenimientosInterface {
  total: number;
  limit: number;
  offset: number;
  mantenimientos: Mantenimiento[];
}

export interface Mantenimiento {
  id: string;
  tipo: TipoMantenimiento;
  descripcion: string;
  fecha_inicio: Date;
  fecha_final: Date;
  costo: string;
  proximoMantenimiento: Date;
  equipo: Equipo;
  finca: Finca;
}

export interface Equipo {
  id: string;
  nombre: string;
  codigoInterno: string;
  tipo: string;
  marca: string;
  modelo: string;
  estado: string;
}

export interface Finca {
  id: string;
  nombre: string;
  ubicacion: string;
}
