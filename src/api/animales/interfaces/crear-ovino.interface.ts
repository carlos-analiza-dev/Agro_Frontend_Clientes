import { PurezaEnum } from "@/interfaces/enums/animales/animales-enums";
import { TipoAlimentacion } from "./crear-animal.interface";

export interface LanaData {
  fecha_esquila?: string;
  calidad_micras?: number;
  color_lana?: string;
  peso_vellon?: number;
}

export interface HistorialEsquilaData {
  fecha_esquila: string;
  peso_vellon_kg?: number;
  calidad_clasificacion?: string;
  esquilador_responsable?: string;
  observaciones?: string;
}

export interface ParasitosData {
  famacha?: number;
  tratamiento?: string;
  fecha_tratamiento?: string;
  observaciones?: string;
}

export interface FormOvinoData {
  identificador: string;
  nombre_animal?: string;

  fincaId: string;
  especie: string;
  propietarioId: string;

  padreId?: string;
  madreId?: string;

  razaIds: string[];

  sexo: string;
  color: string;
  peso: number;
  condicion_corporal: string;

  fecha_nacimiento?: string;
  edad_promedio?: number;

  nombre_criador_origen_animal?: string;
  observaciones?: string;

  tipo_alimentacion?: TipoAlimentacion[];

  potrero?: string;
  pezunas?: string;
  ganancia_peso?: number;

  mortalidad?: boolean;
  desparasitado?: boolean;

  vacunas?: string;
  tratamientos?: string;

  categoria_edad?: string;
  proposito: string;
  tipo_nacimiento?: string;

  nombre_padre?: string;
  arete_padre?: string;
  razas_padre?: string[];
  pureza_padre?: PurezaEnum;
  nombre_criador_padre?: string;
  nombre_propietario_padre?: string;
  nombre_finca_origen_padre?: string;

  nombre_madre?: string;
  arete_madre?: string;
  razas_madre?: string[];
  pureza_madre?: PurezaEnum;
  nombre_criador_madre?: string;
  nombre_propietario_madre?: string;
  nombre_finca_origen_madre?: string;

  numero_parto_madre?: number;

  peso_nacimiento?: number;
  peso_destete?: number;

  lana?: LanaData;
  historial_esquila?: HistorialEsquilaData[];

  famacha?: number;
  parasitos?: ParasitosData[];
}
