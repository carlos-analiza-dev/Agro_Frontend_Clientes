export interface ResponseAuditoriaProductos {
  total: number;
  limit: number;
  offset: number;
  data: AuditoriaProductos[];
}

export interface AuditoriaProductos {
  id: string;
  accion: string;
  fecha: Date;
  producto: Producto;
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

export interface Producto {
  id: string;
  nombre: string;
}
