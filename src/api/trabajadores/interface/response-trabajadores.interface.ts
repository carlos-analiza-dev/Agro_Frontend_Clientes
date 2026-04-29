import { TipoCliente } from "@/interfaces/enums/clientes.enums";

export interface ResponseTrabajadoresInterface {
  trabajadores: Trabajador[];
  total: number;
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
  rol: TipoCliente;
  isActive: boolean;
  createdAt: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  propietario: Propietario;
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
}
