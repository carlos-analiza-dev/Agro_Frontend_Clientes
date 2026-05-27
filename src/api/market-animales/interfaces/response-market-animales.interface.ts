export interface ResponseMarketAnimalesInterface {
  total: number;
  limit: number;
  offset: number;
  radio_km: number;
  usando_google_maps: boolean;
  ubicacion_usuario: UbicacionUsuario;
  productos: Producto[];
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  precio_oferta: string;
  moneda: string;
  stock: number;
  disponible: boolean;
  favoritos: number;
  views: number;
  created_at: Date;
  imagenes: Imagene[];
  animal: Animal;
  categoria: Categoria;
  subcategoria: Categoria;
  marca: null;
  tipo_producto: Categoria;
  vendedor: Vendedor;
  ubicacion: Ubicacion;
  distancia_km: number;
  tiempo_estimado_minutos: number;
  distancia_linea_recta_km: number;
  ubicacion_producto: UbicacionProducto;
}

export interface Animal {
  id: string;
  identificador: string;
  sexo: string;
  color: string;
  edad_promedio: number;
  tipo_produccion: string;
  produccion: string;
  especie: null;
  razas: any[];
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Imagene {
  id: string;
  url: string;
}

export interface Ubicacion {
  pais: string;
  departamento: string;
}

export interface UbicacionProducto {
  latitud: string;
  longitud: string;
  direccion: string;
}

export interface Vendedor {
  id: string;
  nombre: string;
  telefono: string;
}

export interface UbicacionUsuario {
  latitud: string;
  longitud: string;
}
