import { Cliente } from "@/interfaces/auth/cliente";
import { TipoSucursal } from "./crear-sucursal.interface";

export interface ResponseSucursalesAgro {
  sucursales: SucursaleAgro[];
  total: number;
}

export interface SucursaleAgro {
  id: string;
  nombre: string;
  tipo: TipoSucursal;
  latitud: string;
  longitud: string;
  direccion_complemento: string;
  createdAt: Date;
  pais: Departamento;
  departamento: Departamento;
  municipio: Departamento;
  gerente: Cliente;
}

export interface Departamento {
  id: string;
  nombre: string;
}
