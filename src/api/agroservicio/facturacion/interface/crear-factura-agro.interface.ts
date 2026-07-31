export interface CrearFacturaAgroInterface {
  id_cliente: string;
  descuento_id: string;
  sucursal_id: string;
  forma_pago: string;
  estado: string;
  sub_total: number;
  importe_exento: number;
  importe_exonerado: number;
  importe_gravado_15: number;
  importe_gravado_18: number;
  isv_15: number;
  isv_18: number;
  cargos_extra: number;
  detalles: Detalle[];
}

export interface Detalle {
  id_producto: string;
  cantidad: number;
  precio: number;
  total: number;
}
