import {
  EstadoActividad,
  FrecuenciaActividad,
  TipoActividad,
} from "@/interfaces/enums/actividaes.enums";

export interface ResponseActividadesInterface {
  actividades: Actividade[];
  total: number;
  limit: number;
  offset: number;
}

export interface Actividade {
  id: string;
  fecha: string;
  tipo: TipoActividad;
  estado: EstadoActividad;
  frecuencia: FrecuenciaActividad;
  descripcion: string;
  completada: boolean;
  createdAt: Date;
  propietario: Propietario;
  finca: Finca;
  trabajador: Trabajador;
  fotos: Foto[];
}

export interface Finca {
  id: string;
  nombre_finca: string;
  ubicacion: string;
}

export interface Foto {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  actividadId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Propietario {
  id: string;
  nombre: string;
  telefono: string;
}

export interface Trabajador {
  id: string;
  nombre: string;
}
