import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";

export interface ResponseMISPublicaciones {
  total: number;
  limit: number;
  offset: number;
  productos: ProductoPublish[];
}

export interface ProductoPublish {
  id: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  modelo: string;
  precio: string;
  moneda: string;
  stock: number;
  precioPorHora?: number;
  precioPorDia?: number;
  precioPorSemana?: number;
  precioPorMes?: number;

  requiereDeposito?: boolean;
  montoDeposito?: number;
  latitud: string;
  longitud: string;
  disponible: boolean;
  tipo_publicacion: TipoPublicacion;
  vendido: boolean;
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
}

export interface Animal {
  id: string;
  identificador: string;
  sexo: string;
  color: string;
  edad_promedio: number;
  tipo_produccion: string;
  produccion: string;
  especie: Categoria;
  razas: Categoria[];
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

export interface Vendedor {
  id: string;
  nombre: string;
  telefono: string;
  create: Date;
  imagenes: any[];
}
