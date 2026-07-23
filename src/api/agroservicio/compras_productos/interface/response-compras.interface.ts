export interface ResponseComprasInterface {
  compras: Compra[];
  total: number;
}

export interface Compra {
  id: string;
  proveedorId: string;
  sucursalId: string;
  tipo_pago: string;
  subtotal: string;
  impuestos: string;
  descuentos: string;
  numero_factura: string;
  total: string;
  fecha: string;
  created_at: Date;
  updated_at: Date;
  createdById: string;
  updatedById: string;
  detalles: Detalle[];
  lotes: Lote[];
  proveedor: Proveedor;
  sucursal: Sucursal;
}

export interface Detalle {
  id: string;
  compraId: string;
  productoId: string;
  costo_por_unidad: string;
  cantidad: string;
  bonificacion: string;
  cantidad_total: string;
  descuentos: string;
  impuestos: string;
  monto_total: string;
}

export interface Lote {
  id: string;
  id_compra: string;
  id_sucursal: string;
  id_producto: string;
  cantidad: string;
  costo: string;
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
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: string;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  gerenteId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
