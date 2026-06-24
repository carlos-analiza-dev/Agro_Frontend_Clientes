import { UsoEquinoEnum } from "@/interfaces/enums/animales/use-equino.enum";

export interface CrearAnimalByFinca {
  especie: string;
  sexo: string;
  color: string;
  padreId?: string;
  madreId?: string;
  nombre_animal?: string;
  tipo_alimentacion: TipoAlimentacion[];
  complementos?: TipoComplemento[];
  medicamento?: string;
  identificador: string;
  razaIds: string[];
  edad_promedio: number;
  fecha_nacimiento?: string;
  observaciones?: string;
  animal_muerte?: boolean;
  razon_muerte?: string;
  propietarioId: string;
  fincaId: string;
  castrado: boolean;
  esterelizado: boolean;
  pureza: string;
  produccion: string;
  tipo_produccion: string;
  tipo_reproduccion: string;
  compra_animal?: boolean;
  nombre_criador_origen_animal?: string;
  images?: File[];

  nombre_padre?: string;
  arete_padre?: string;
  razas_padre?: string[];
  pureza_padre: string;
  nombre_criador_padre?: string;
  nombre_propietario_padre?: string;
  nombre_finca_origen_padre?: string;

  nombre_madre?: string;
  arete_madre?: string;
  razas_madre?: string[];
  pureza_madre: string;
  nombre_criador_madre?: string;
  nombre_propietario_madre?: string;
  nombre_finca_origen_madre?: string;
  numero_parto_madre: number;

  //EQUIMO
  uso_equino?: UsoEquinoEnum;
  desparasitado?: boolean;
  vacunas?: string;
  veterinario?: string;
  peso_actual?: number;
  condicion_corporal?: string;
  nivel_entrenamiento?: string;
  resultados_competencias?: string;
  historial_reproductivo?: string;
  valor_estimado?: number;
  asegurado?: boolean;
}

export interface TipoAlimentacion {
  alimento: string;
  origen: string;
  porcentaje_comprado?: number;
  porcentaje_producido?: number;
}

export interface TipoComplemento {
  complemento: string;
}
