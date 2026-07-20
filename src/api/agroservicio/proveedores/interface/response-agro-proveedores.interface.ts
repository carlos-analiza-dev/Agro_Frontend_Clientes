export interface ResponseAgroProveedores {
  proveedores: ProveedoreAgro[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProveedoreAgro {
  id: string;
  nit_rtn: string;
  nrc: string;
  nombre_legal: string;
  complemento_direccion: string;
  telefono: string;
  correo: string;
  nombre_contacto: string;
  plazo: null;
  tipo_escala: TipoEscala;
  is_active: boolean;
  tipo_pago_default: TipoPagoProveedor;
  created_at: string;
  updated_at: string;
  agroservicio: Agroservicio;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
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

export enum TipoPagoProveedor {
  CONTADO = "CONTADO",
  CREDITO = "CREDITO",
}

export enum TipoEscala {
  ESCALA = "ESCALA",
  DESCUENTO = "DESUENTO",
}
