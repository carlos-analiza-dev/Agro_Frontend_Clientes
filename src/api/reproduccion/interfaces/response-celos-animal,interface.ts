export interface ResponseCelosAnimalInterface {
  celos: Celo[];
  total: number;
  offset: number;
  limit: number;
  totalPages: number;
}

export interface Celo {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  numeroCelo: number;
  intensidad: string;
  metodo_deteccion: string;
  observaciones: string;
  signos_observados: SignosObservados;
  fechaRegistro: Date;
  animal: Animal;
}

export interface Animal {
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
  especie: Especie;
  finca: Finca;
  propietario: Propietario;
}

export interface Complemento {
  complemento: string;
}

export interface Especie {
  id: string;
  nombre: string;
  isActive: boolean;
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

export interface TipoAlimentacion {
  origen: string;
  alimento: string;
}

export interface SignosObservados {
  otros: string[];
  inquietud: boolean;
  monta_otros: boolean;
  secreciones: string;
  acepta_monta: boolean;
  vulva_inflamada: boolean;
}
