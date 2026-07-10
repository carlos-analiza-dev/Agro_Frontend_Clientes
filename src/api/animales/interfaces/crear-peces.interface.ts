export enum EtapaPez {
  ALEVIN = "Alevín",
  JUVENIL = "Juvenil",
  ENGORDE = "Engorde",
}

export interface Muestreo {
  fecha_muestreo?: string;
  peso?: number;
  talla?: number;
}

export interface RecambioAgua {
  fecha_recambio?: string;
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
  turbidez?: number;
  historial_recambios?: RecambioAgua[];
}

export interface Sanidad {
  signos_clinicos?: string;
  tratamientos?: string;
  banos_salinidad?: string;
  laboratorio?: string;
}

export interface PecesData {
  especie: string;
  fincaId: string;
  razaIds: string[];

  identificador?: string;

  estanque_tanque_jaula?: string;
  proveedor_alevines?: string;
  fecha_siembra?: string;

  cantidad_inicial?: number;
  talla_peso_inicial?: string;
  densidad_por_m3_m2?: number;
  cantidad_actual?: number;
  mortalidad_diaria_acum?: string;

  muestreos?: Muestreo[];

  etapa?: EtapaPez;

  peso_promedio?: number;
  biomasa_estimada?: number;
  talla?: number;
  fecha_muestreo?: string;

  calidad_agua?: CalidadAgua;

  tipo_concentrado?: string;
  proteina_porcentaje?: number;
  racion_diaria?: string;
  consumo?: string;
  conversion_alimenticia?: number;

  sanidad?: Sanidad;

  lote_activo?: boolean;
}
