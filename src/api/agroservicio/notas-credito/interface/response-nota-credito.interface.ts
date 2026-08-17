export interface ResponseNotaCreditoInterface {
  total: number;
  notas: Nota[];
}

export interface Nota {
  id: string;
  factura_id: string;
  monto: string;
  motivo: string;
  agroservicioId: string;
  createdAt: Date;
  updatedAt: Date;
  agroservicio: Agroservicio;
  factura: Factura;
  detalles: Detalle[];
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

export interface Detalle {
  id: string;
  nota_id: string;
  producto_id: string;
  cantidad: number;
  montoDevuelto: string;
}

export interface Factura {
  id: string;
  id_cliente: string;
  agroservicioId: string;
  sucursal_id: string;
  forma_pago: string;
  estado: string;
  numero_factura: string;
  fecha_limite_emision: string;
  fecha_recepcion: string;
  rango_autorizado: string;
  cai: string;
  autorizada_cancelacion: boolean;
  rango_factura_id: string;
  sub_total: string;
  descuentos_rebajas: string;
  importe_exento: string;
  importe_exonerado: string;
  importe_gravado_15: string;
  importe_gravado_18: string;
  isv_15: string;
  isv_18: string;
  cargos_extra: string;
  total: string;
  total_letras: string;
  created_at: string;
  updated_at: string;
  fecha_autorizacion_cancelacion: null;
}
