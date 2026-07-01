import { TipoAlimentacion } from "./crear-animal.interface";

export interface FormPorcinoData {
  identificador: string;
  nombre_animal: string;
  fincaId: string;
  sexo: string;
  color: string;
  razaIds: string[];

  tipo_registro_porcino?: string;
  etapa_porcino?: string;
  corral_galera?: string;
  lote?: string;
  proveedor?: string;

  fecha_ingreso_porcino?: string | Date;

  cantidad_inicial_porcino?: number;
  cantidad_actual_porcino?: number;

  peso_inicial_porcino?: number;
  peso_promedio?: string;
  ganancia_peso?: number;

  fecha_pesaje_porcino?: string | Date;

  tipo_alimentacion?: TipoAlimentacion[];

  consumo_diario_porcino?: number;

  vacunas?: string;
  tratamientos?: string;
  condicion_corporal?: string;

  desparasitado?: boolean;
  mortalidad?: boolean;
  bajas_mortalidad_porcino?: number;

  cuarentena_porcino?: boolean;

  fecha_salida_porcino?: string | Date;

  peso_salida_porcino?: number;
  comprador_porcino?: string;
  precio_porcino?: number;
  rendimiento_canal_porcino?: number;

  propietarioId?: string;

  nombre_criador_origen_animal?: string;
  observaciones?: string;

  especie: string;
}
