import { SucursaleAgro } from "../../agro-sucursales/interface/response-sucursales-agro.interface";

export enum TipoMovimiento {
  SALIDA = "SALIDA",
  DEVOLUCION = "DEVOLUCION",
  AJUSTE = "AJUSTE",
}

export interface ResponseMovimientosLotesInterface {
  total: number;
  movimientos: MovimientoLote[];
}

export interface MovimientoLote {
  id: string;
  lote_id: string;
  factura_id: string;
  producto_id: string;
  cantidad: string;
  tipo: TipoMovimiento;
  descripcion: string;
  fecha: string;
  cantidad_anterior: string;
  cantidad_nueva: string;
  lote: Lote;
  factura: Factura;
  producto: Producto;
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
  created_at: Date;
  updated_at: Date;
  fecha_autorizacion_cancelacion: Date | null;
  agroservicio: Agroservicio;
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

export interface Lote {
  id: string;
  id_compra: string;
  id_sucursal: string;
  id_producto: string;
  cantidad: string;
  costo: string;
  costo_por_unidad: string;
  created_at: Date;
  updated_at: Date;
  sucursal: SucursaleAgro;
}

export interface Producto {
  id: string;
  nombre: string;
  unidad_venta: string;
  tipo_fraccionamiento: null;
  isActive: boolean;
  disponible: boolean;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  precio: string;
  costo: string;
  es_compra_bodega: boolean;
  compra_minima: number;
  distribucion_minima: number;
  venta_minima: number;
  unidad_fraccionamiento: number;
  contenido: number;
  componentes: Componente[];
  tipos_uso: string[];
  forma_uso: string;
  indicaciones: string[];
  taxId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Componente {
  nombre: string;
  unidad: string;
  cantidad: string;
}
