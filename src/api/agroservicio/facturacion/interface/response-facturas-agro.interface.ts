export interface ResponseFacturasAgroInterface {
  total: number;
  data: AgroFactura[];
}

export interface AgroFactura {
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
  cliente: Cliente;
  rango_factura: RangoFactura;
  agroservicio: Agroservicio;
  detalles: Detalle[];
  descuento: Descuento;
  sucursal: Sucursal;
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

export interface Cliente {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  isActive: boolean;
  fecha: Date;
}

export interface Descuento {
  id: string;
  nombre: string;
  porcentaje: string;
}

export interface Detalle {
  id: string;
  id_factura: string;
  id_producto: string;
  cantidad: number;
  precio: string;
  total: string;
  created_at: Date;
  updated_at: Date;
}

export interface RangoFactura {
  id: string;
  cai: string;
  prefijo: string;
  rango_inicial: number;
  rango_final: number;
  correlativo_actual: number;
  fecha_recepcion: Date;
  fecha_limite_emision: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: string;
  latitud: string;
  longitud: string;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  gerenteId: string;
  agroservicioId: string;
  creadoPorId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
