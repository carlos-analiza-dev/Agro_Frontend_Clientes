export interface ResponseEscalasProductoInterface {
  data: Escala[];
  total: number;
}

export interface Escala {
  id: string;
  cantidad_comprada: number;
  bonificacion: number;
  costo: number;
  isActive: boolean;
  producto: Producto;
  proveedor: Proveedor;
  pais: Pais;
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

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface Producto {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  tipo: string;
  unidad_venta: string;
  descripcion: string;
  servicioId: null;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: string;
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
  plazo: null;
  tipo_escala: string;
  is_active: boolean;
  tipo_pago_default: string;
  created_at: Date;
  updated_at: Date;
}
