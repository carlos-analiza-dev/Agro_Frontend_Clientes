import { Cliente } from "./cliente";

export interface Empleado {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  isActive: boolean;
  createdAt: string;
  role: RoleEmpleado;
  sucursal: SucursalEmpleado;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  agroservicio: AgroservicioEmpleado;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
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
}

export interface RoleEmpleado {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface AgroservicioEmpleado {
  id: string;
  nombre: string;
  rtn: string;
  correo: string;
  telefono: string;
  direccion: string;
  propietario: Cliente;
}

export interface SucursalEmpleado {
  id: string;
  nombre: string;
  tipo: string;
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
}
