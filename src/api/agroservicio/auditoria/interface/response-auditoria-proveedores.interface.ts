export interface ResponseAuditoriaProveedores {
  total: number;
  limit: number;
  offset: number;
  data: Auditoria[];
}

export interface Auditoria {
  id: string;
  proveedorId: string;
  accion: string;
  empleadoId: string;
  fecha: Date;
  proveedor: Proveedor;
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
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Proveedor {
  id: string;
  nit_rtn: string;
  nrc: string;
  nombre_legal: string;
  complemento_direccion: string;
  telefono: string;
  correo: string;
  nombre_contacto: string;
  plazo: number;
  tipo_escala: string;
  is_active: boolean;
  tipo_pago_default: string;
  created_at: Date;
  updated_at: Date;
}
