export interface ResponseRatingProductos {
  id: string;
  promedio: string;
  total_opiniones: number;
  estrellas_1: number;
  estrellas_2: number;
  estrellas_3: number;
  estrellas_4: number;
  estrellas_5: number;
  producto: Producto;
}

export interface Producto {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  tipo: string;
  unidad_venta: string;
  tipo_fraccionamiento: null;
  contenido: number;
  descripcion: string;
  servicioId: null;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  compra_minima: number;
  unidad_fraccionamiento: number;
  distribucion_minima: number;
  venta_minima: number;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: string;
}
