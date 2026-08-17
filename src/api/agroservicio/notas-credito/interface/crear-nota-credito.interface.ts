export interface CrearNotaCreditoInterface {
  factura_id: string;
  monto: number;
  motivo: string;
  detalles: Detalle[];
}

export interface Detalle {
  producto_id: string;
  cantidad: number;
  montoDevuelto: number;
}
