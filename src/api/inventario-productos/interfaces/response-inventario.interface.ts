export interface ResponseInventarioInterface {
  data: Inventario[];
  total: number;
  limit: number;
  offset: number;
}

export interface Inventario {
  id: string;
  cantidad: string;
  unidadMedida: string;
  stockMinimo: string;
  createdAt: string;
  updatedAt: string;
  producto: Producto;
  finca: Finca;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  latitud: number;
  longitud: number;
  abreviatura: string;
  tamaño_total: string;
  area_ganaderia: string;
  medida_finca: string;
  tipo_explotacion: TipoExplotacion[];
  especies_maneja: EspeciesManeja[];
  fecha_registro: Date;
  isActive: boolean;
}

export interface EspeciesManeja {
  especie: string;
  cantidad: number;
}

export interface TipoExplotacion {
  tipo_explotacion: string;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  propietario: Propietario;
}

export interface Propietario {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  verified: boolean;
  isActive: boolean;
  createdAt: Date;
}
