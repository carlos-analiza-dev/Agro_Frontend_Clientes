import {
  EstadoParto,
  SexoCria,
  TipoParto,
} from "@/interfaces/enums/partos.enums";

export interface ResposnePartosInterface {
  data: Parto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Parto {
  id: string;
  fecha_parto: string;
  numero_parto: number;
  tipo_parto: TipoParto;
  estado: EstadoParto;
  numero_crias: number;
  numero_crias_vivas: number;
  numero_crias_muertas: number;
  crias: Cria[];
  observaciones: string;
  complicaciones: string;
  atencion_veterinaria: string;
  veterinario_responsable: string;
  dias_gestacion: number;
  semanas_gestacion: number;
  fecha_registro: Date;
  ultima_actualizacion: Date;
  hembra: Hembra;
  servicio_asociado: ServicioAsociado;
}

export interface Cria {
  peso: number;
  sexo: SexoCria;
  estado: string;
  identificador: string;
  observaciones: string;
  fecha_nacimiento: string;
}

export interface Hembra {
  id: string;
  sexo: string;
  color: string;
  identificador: string;
  tipo_reproduccion: string;
  pureza: string;
  edad_promedio: number;
  fecha_nacimiento: Date;
  observaciones: string;
  tipo_alimentacion: TipoAlimentacion[];
  complementos: Complemento[];
  medicamento: string;
  produccion: string;
  tipo_produccion: string;
  animal_muerte: boolean;
  razon_muerte: string;
  compra_animal: boolean;
  nombre_criador_origen_animal: string;
  nombre_padre: string;
  arete_padre: string;
  pureza_padre: string;
  nombre_criador_padre: string;
  nombre_propietario_padre: string;
  nombre_finca_origen_padre: string;
  nombre_madre: string;
  arete_madre: string;
  pureza_madre: string;
  nombre_criador_madre: string;
  nombre_propietario_madre: string;
  nombre_finca_origen_madre: string;
  numero_parto_madre: number;
  fecha_registro: Date;
  castrado: boolean;
  esterelizado: boolean;
  finca: Finca;
}

export interface Complemento {
  complemento: string;
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

export interface TipoAlimentacion {
  origen: string;
  alimento: string;
}

export interface ServicioAsociado {
  id: string;
  macho_externo_nombre: null;
  macho_pertenece_finca: boolean;
  tipo_servicio: string;
  estado: string;
  fecha_servicio: Date;
  numero_servicio: number;
  dosis_semen: string;
  proveedor_semen: string;
  tecnico_responsable: string;
  exitoso: boolean;
  observaciones: string;
  metadata: Metadata;
  fecha_registro: Date;
  ultima_actualizacion: Date;
}

export interface Metadata {
  costo: number;
  duracion_minutos: number;
  evaluacion_macho: string;
  condiciones_climaticas: string;
}
