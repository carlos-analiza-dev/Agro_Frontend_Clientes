import { TipoSucursal } from "../../agro-sucursales/interface/crear-sucursal.interface";

export interface ResponseAuditoriaEmpleados {
  data: AuditoriaEmpleado[];
  total: number;
  limit: number;
  offset: number;
}

export interface AuditoriaEmpleado {
  id: string;
  descripcion: string;
  accion: string;
  empleadoId: string;
  fecha: string;
  empleado: Empleado;
}

export interface Empleado {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  creadoPorId: string;
  isActive: boolean;
  createdAt: Date;
  sucursal: Sucursal;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: TipoSucursal;
  latitud: string;
  longitud: string;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  gerenteId: string;
  agroservicioId: string;
  creadoPorId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  agroservicio: Agroservicio;
}

export interface Agroservicio {
  id: string;
  nombre_agroservicio: string;
  rtn: string;
  propietarioId: string;
  paisId: string;
  correo: string;
  telefono: string;
  direccion: string;
  created_at: Date;
  updated_at: Date;
}
