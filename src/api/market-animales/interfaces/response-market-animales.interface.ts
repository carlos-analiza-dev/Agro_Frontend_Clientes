import { Especie } from "@/api/dashboard/interfaces/response-especies-fincas.interface";
import { Marca } from "@/api/marcas/interface/response-marcas.interface";
import { Raza } from "@/api/peso-promedio-animal/interfaces/obtener-pesos-by-raza.interface";
import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";

export interface ResponseMarketAnimalesInterface {
  total: number;
  limit: number;
  offset: number;
  radio_km: number;
  usando_google_maps: boolean;
  ubicacion_usuario: UbicacionUsuario;
  productos: ProductoAnimal[];
}

export interface ProductoAnimal {
  id: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  modelo: string;
  precio: string;
  precio_oferta: string;
  moneda: string;
  stock: number;
  disponible: boolean;
  latitud: string;
  longitud: string;
  vendido: boolean;
  oferta: boolean;
  favoritos: number;
  tipo_publicacion: TipoPublicacion;
  views: number;
  created_at: string;
  imagenes: Imagene[];
  animal: Animal;
  categoria: Categoria;
  subcategoria: Categoria;
  marca: Marca | null;
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
  especie: Especie;
  razas: Raza[];
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
  create: string;
  imagenes: Imagene[];
}

export interface UbicacionUsuario {
  latitud: string;
  longitud: string;
}
