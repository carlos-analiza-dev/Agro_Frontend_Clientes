export interface ResponseAuditoriaCompraInterface {
  total: number;
  limit: number;
  offset: number;
  data: AuditoriaCompra[];
}

export interface AuditoriaCompra {
  id: string;
  accion: string;
  fecha: Date;
  compra: Compra;
  empleado: Empleado;
}

export interface Compra {
  id: string;
  numero_factura: string;
  total: string;
  fecha: Date;
  proveedor: Proveedor;
}

export interface Proveedor {
  id: string;
  nombre_legal: string;
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
