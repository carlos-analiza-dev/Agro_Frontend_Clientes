export interface CrearCompraAgroInsumoInterface {
  proveedorId: string;
  sucursalId: string;
  tipo_pago: string;
  impuestos: number;
  detalles: Detalle[];
}

export interface Detalle {
  insumoId: string;
  costo_por_unidad: number;
  cantidad: number;
  bonificacion: number;
  descuentos: number;
  impuestos: number;
  cantidad_total: number;
  monto_total: number;
}
