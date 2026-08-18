export interface ResponseComprasProductosClienteInterface {
  data: ProductosCompras[];
  pagination: Pagination;
  estadisticas_generales: EstadisticasGenerales;
}

export interface ProductosCompras {
  id: string;
  nombre: string;
  codigo: string;
  precio_actual: number;
  categoria: string;
  estadisticas: Estadisticas;
}

export interface Estadisticas {
  total_comprado: number;
  total_facturas: number;
  total_monto: number;
  promedio_por_factura: number;
  frecuencia_compra: number;
  primera_compra: string;
  ultima_compra: string;
}

export interface EstadisticasGenerales {
  total_facturas: number;
  total_gastado: number;
  promedio_factura: number;
  total_productos_unicos: number;
  primera_compra: string;
  ultima_compra: string;
  total_subtotal: number;
  total_isv: number;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
