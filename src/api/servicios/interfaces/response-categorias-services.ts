export interface ResponseCategoriasServicesInterface {
  servicios: Servicio[];
  total: number;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  isActive: boolean;
  createdAt: Date;
  updateAt: Date;
  subServicios: SubServicio[];
}

export interface SubServicio {
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
  servicioId: string;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  compra_minima: number;
  unidad_fraccionamiento: number;
  distribucion_minima: number;
  venta_minima: number;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: null;
  preciosPorPais: PreciosPorPai[];
}

export interface PreciosPorPai {
  id: string;
  precio: string;
  costo: string;
  tiempo: number;
  cantidadMin: number;
  cantidadMax: number;
  pais: Pais;
  insumos: InsumoElement[];
}

export interface InsumoElement {
  id: string;
  servicioPaisId: string;
  insumoId: string;
  cantidad: number;
  createdAt: Date;
  updatedAt: Date;
  insumo: InsumoInsumo;
}

export interface InsumoInsumo {
  id: string;
  nombre: string;
  codigo: string;
  costo: string;
  unidad_venta: string;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pais {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
}
