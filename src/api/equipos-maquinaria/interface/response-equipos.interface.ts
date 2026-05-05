import { EstadoMaquinaria } from "@/interfaces/enums/maquinaria/maquinaria.enums";

export interface ResponseEquiposInterface {
  limit: number;
  offset: number;
  equipos: Equipo[];
}

export interface Equipo {
  id: string;
  nombre: string;
  codigoInterno: string;
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  fechaCompra: Date;
  costoCompra: string;
  estado: EstadoMaquinaria;
  horasUso: string;
  vidaUtilHoras: string;
  fincaId: string;
  createdAt: Date;
  updatedAt: Date;
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
  fecha_actualizacion: Date;
  creadoPorId: null;
  actualizadoPorId: null;
  isActive: boolean;
}

export interface EspeciesManeja {
  especie: string;
  cantidad: number;
}

export interface TipoExplotacion {
  tipo_explotacion: string;
}
