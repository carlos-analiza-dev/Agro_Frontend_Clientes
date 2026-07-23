export interface CrearCompraInterface {
  proveedorId: string;
  sucursalId: string;
  tipo_pago: string;
  subtotal: number;
  descuentos: number;
  impuestos: number;
  total: number;
  numero_factura?: string;
  detalles: Detalle[];
}

export interface Detalle {
  productoId: string;
  costo_por_unidad: number;
  cantidad: number;
  bonificacion: number;
  descuentos: number;
  impuestos: number;
}
