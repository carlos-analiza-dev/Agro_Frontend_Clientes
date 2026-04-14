export enum EstadoPedido {
  PENDIENTE = "pendiente",
  PROCESADO = "procesado",
  FACTURADO = "facturado",
  CANCELADO = "cancelado",
}

export enum TipoEntrega {
  DELIVERY = "delivery",
  RECOGER = "recoger",
}

export interface CrearPedidoInterface {
  id_sucursal?: string;
  sub_total: number;
  importe_exento?: number;
  importe_exonerado?: number;
  importe_gravado_15?: number;
  importe_gravado_18?: number;
  isv_15?: number;
  isv_18?: number;
  total: number;
  estado: EstadoPedido;
  detalles: Detalle[];
  direccion_entrega?: string;
  latitud?: number;
  longitud?: number;
  tipo_entrega: TipoEntrega;
  costo_delivery?: number;
  nombre_finca?: string;
}

export interface Detalle {
  id_producto: string;
  cantidad: number;
  precio: number;
  total: number;
}
