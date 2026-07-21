export enum UnidadVenta {
  UNIDAD = "unidad",
  KILOGRAMO = "kilogramo",
  GRAMO = "gramo",
  MILIGRAMO = "miligramo",
  LIBRA = "libra",
  ONZA = "onza",
  GALON = "galon",
  LITRO = "litro",
  CENTILITRO = "centilitro",
  MILILITRO = "mililitro",
  METRO = "metro",
  CENTIMETRO = "centimetro",
  MILIMETRO = "milimetro",
  PIE = "pie",
  PULGADA = "pulgada",
  M2 = "m2",
  CM2 = "cm2",
  PIE2 = "pie2",
  M3 = "m3",
  PIEZA = "pieza",
}

export interface Componente {
  nombre: string;
  cantidad?: string;
  unidad?: string;
}

export interface CrearAgroProducto {
  nombre: string;
  unidad_venta?: UnidadVenta;
  tipo_fraccionamiento?: UnidadVenta;
  isActive?: boolean;
  disponible?: boolean;
  marcaId?: string;
  proveedorId: string;
  categoriaId: string;
  subcategoriaId: string;
  tipo_producto_id: string;
  taxId?: string;
  codigo_barra: string;
  atributos: string;
  precio: number;
  costo: number;
  es_compra_bodega?: boolean;
  compra_minima?: number;
  distribucion_minima?: number;
  venta_minima?: number;
  unidad_fraccionamiento?: number;
  contenido?: number;
  componentes?: Componente[];
  tipos_uso?: string[];
  forma_uso?: string;
  indicaciones?: string[];
}
