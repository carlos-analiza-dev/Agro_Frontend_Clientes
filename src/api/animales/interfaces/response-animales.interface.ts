import { TipoAve } from "@/interfaces/enums/animales/animales-enums";
import { UsoEquinoEnum } from "@/interfaces/enums/animales/use-equino.enum";
import { EtapaAvicola } from "./crear-avicola.interface";

export interface ResponseAnimalesByPropietario {
  data: Animal[];
  total: number;
  limit: number;
  offset: number;
}

export interface Animal {
  id: string;
  sexo: string;
  color: string;
  padre: Animal;
  madre: Animal;
  nombre_animal: string;
  identificador: string;
  tipo_reproduccion: string;
  pureza: string;
  tipo_produccion: string;
  animal_muerte: boolean;
  razon_muerte: string;
  pureza_padre: string;
  pureza_madre: string;
  edad_promedio: number;
  fecha_nacimiento: string;
  observaciones: string;
  tipo_alimentacion: TipoAlimentacion[];
  complementos: ComplementoElement[] | null;
  medicamento: string;
  compra_animal: boolean;
  nombre_criador_origen_animal: string;
  nombre_padre: string;
  arete_padre: null | string;
  nombre_criador_padre: null | string;
  nombre_propietario_padre: null | string;
  nombre_finca_origen_padre: string;
  nombre_madre: string;
  arete_madre: null | string;
  nombre_criador_madre: null | string;
  nombre_propietario_madre: null | string;
  nombre_finca_origen_madre: string;
  numero_parto_madre: number;
  fecha_registro: string;
  castrado: boolean;
  esterelizado: boolean;
  finca: Finca;
  propietario: Propietario;
  especie: EspecieClass;
  razas: EspecieClass[];
  razas_madre: EspecieClass[];
  razas_padre: EspecieClass[];
  profileImages: ProfileImage[];
  lote_activo?: boolean;

  // EQUINO
  uso_equino?: UsoEquinoEnum;
  desparasitado?: boolean;
  vacunas?: string;
  veterinario?: string;
  peso_actual?: number;
  nivel_entrenamiento?: string;
  resultados_competencias?: string[];
  historial_reproductivo?: string[];
  valor_estimado?: number;
  asegurado?: boolean;
  alzada?: number;
  unidad_alzada: "cm" | "manos";
  condicion_corporal:
    | "excelente"
    | "muy_buena"
    | "buena"
    | "regular"
    | "mala"
    | "muy_mala"
    | "caquexica"
    | "obesa";
  registro_genealogico?: string;
  microchip?: string;
  odontologia?: string;
  alergias?: string;
  lesiones?: string;
  precio_compra?: number;

  // AVICOLA
  fincaId: string;
  cantidad_lote?: number;
  tipo_ave?: TipoAve;
  proveedor_aves?: string;
  galpon?: string;
  mortalidad_diaria?: number;
  consumo_alimento?: string;
  consumo_agua?: string;
  peso_promedio?: string;
  huevos_diarios?: number;
  huevos_rotos?: number;
  calificacion_huevos?: string;
  vacunas_lote?: string;
  tratamientos?: string;
  porcentaje_postura?: string;
  tipo_concentrado?: string;
  fecha_postura?: Date | string;
  estanque_tanque_jaula?: string;
  proveedor_alevines?: string;
  fecha_siembra?: Date | string;
  cantidad_inicial?: number;
  talla_peso_inicial?: string;
  densidad_por_m3_m2?: number;
  cantidad_actual?: number;
  mortalidad_diaria_acum?: string;
  muestreos?: Muestreo[] | string;
  etapa?: string;
  peso_promedio_pez?: number;
  biomasa_estimada?: number;
  talla_pez?: number;
  fecha_muestreo_pez?: Date | string;
  calidad_agua?: CalidadAgua | string;
  tipo_concentrado_pez?: string;
  proteina_porcentaje?: number;
  racion_diaria?: string;
  consumo_pez?: string;
  conversion_alimenticia?: number;
  sanidad?: Sanidad | string;
  cosecha?: Cosecha | string;
  etapa_avicola?: EtapaAvicola;

  // CAPRINO
  peso?: number;
  proposito?: string;
  potrero?: string;
  linea_genetica?: string;
  litros_leche_dia?: number;
  peso_destete?: number;
  ganancia_peso?: number;
  calidad_leche_grasa?: number;
  calidad_leche_proteina?: number;
  calidad_leche_celulas?: number;
  mastitis?: string;
  pezunas?: string;
  mortalidad?: boolean;
  nombre_criador?: string;

  // OVINO
  categoria_edad?: string;
  peso_nacimiento?: number;
  tipo_nacimiento?: string;
  lana?: {
    fecha_esquila?: string;
    calidad_micras?: number;
    color_lana?: string;
    peso_vellon?: number;
  };
  historial_esquila?: {
    fecha_esquila: string;
    peso_vellon_kg?: number;
    calidad_clasificacion?: string;
    esquilador_responsable?: string;
    observaciones?: string;
  }[];
  famacha?: number;
  parasitos?: {
    famacha?: number;
    tratamiento?: string;
    fecha_tratamiento?: string;
    observaciones?: string;
  }[];

  // PORCINO
  tipo_registro_porcino?: string;
  etapa_porcino?: string;
  corral_galera?: string;
  lote?: string;
  proveedor?: string;
  fecha_ingreso_porcino?: string | Date;
  cantidad_inicial_porcino?: number;
  cantidad_actual_porcino?: number;
  peso_inicial_porcino?: number;
  fecha_pesaje_porcino?: string | Date;
  consumo_diario_porcino?: number;
  conversion_alimenticia_porcino?: number;
  bajas_mortalidad_porcino?: number;
  cuarentena_porcino?: boolean;
  fecha_salida_porcino?: string | Date;
  peso_salida_porcino?: number;
  comprador_porcino?: string;
  precio_porcino?: number;
  rendimiento_canal_porcino?: number;
}

export interface Muestreo {
  fecha_muestreo: string;
  peso?: number;
  talla?: number;
}

export interface RecambioAgua {
  fecha_recambio: string;
  porcentaje_recambio?: number;
  volumen_m3?: number;
  motivo?: string;
  responsable?: string;
}

export interface CalidadAgua {
  temperatura?: number;
  oxigeno_disuelto?: number;
  ph?: number;
  amonio?: number;
  nitrito?: number;
  turbidez?: string;
  historial_recambios?: RecambioAgua[];
}

export interface Sanidad {
  signos_clinicos?: string;
  tratamientos?: string;
  banos_salinidad?: string;
  laboratorio?: string;
}

export interface Cosecha {
  fecha_cosecha?: string;
  kilos_cosechados?: number;
  sobrevivencia_porcentaje?: number;
  comprador?: string;
  precio?: number;
}

export interface ProfileImage {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplementoElement {
  complemento: string;
}

export interface EspecieClass {
  id: string;
  nombre: string;
  isActive: boolean;
  abreviatura?: string;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  latitud: number;
  longitud: number;
  abreviatura: string;
  tamaño_total_hectarea: string;
  area_ganaderia_hectarea: string;
  tipo_explotacion: TipoExplotacionElement[];
  especies_maneja: EspeciesManeja[];
  fecha_registro: Date;
  isActive: boolean;
}

export interface EspeciesManeja {
  especie: string;
  cantidad: number;
}

export interface TipoExplotacionElement {
  tipo_explotacion: string;
}

export interface Propietario {
  id: string;
  email: string;
  name: string;
  identificacion: string;
  direccion: string;
  sexo: string;
  telefono: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: Date;
}

export interface TipoAlimentacion {
  origen: string;
  alimento: string;
  porcentaje_comprado?: number;
  porcentaje_producido?: number;
}
