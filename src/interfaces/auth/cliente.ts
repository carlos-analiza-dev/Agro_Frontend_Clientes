import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { TipoCliente } from "../enums/clientes.enums";

export interface Municipio {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Municipio[];
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
  departamentos: Departamento[];
}

export interface ProfileImage {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientePermiso {
  id: string;
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
  permiso: Permiso;
}

export interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  modulo: string;
  isActive: boolean;
  createdAt: Date;
}

export interface AsignacionTrabajador {
  id: string;
  fechaAsignacion: string;
  finca: Finca;
  asignadoPor: Cliente;
}

export interface Paquete {
  id: string;
  nombre: string;
  tipo: string;
  maxFincas: number;
  maxAnimales: number;
  maxTrabajadores: number;
  isActive: boolean;
  ecommerce: boolean;
}

export interface PaqueteActivo {
  id: string;
  fechaInicio: string;
  fechaFin: string | null;

  fechaInicioFormateada: string;
  fechaFinFormateada: string | null;

  activo: boolean;

  diasRestantes: number;
  diasTotales: number;

  estaVencido: boolean;
  estaPorVencer: boolean;

  paquete: Paquete;
}

export interface Cliente {
  id: string;
  email: string;
  nombre: string;
  identificacion: string;
  direccion: string;
  sexo: string;
  rol: TipoCliente;
  telefono: string;
  isActive: boolean;
  createdAt: string;
  pais: Pais;
  departamento: Departamento;
  municipio: Municipio;
  profileImages: ProfileImage[];
  clientePermisos: ClientePermiso[];
  asignacionesTrabajador?: AsignacionTrabajador[];
  paqueteActivo?: PaqueteActivo | null;
  tienePlanActivo?: boolean;
}

export type ClienteUpdateData = {
  email: string;
  nombre: string;
  identificacion: string;
  direccion: string;
  sexo: string;
  telefono: string;
  pais: string;
  departamento: string;
  municipio: string;
  isActive: boolean;
};
