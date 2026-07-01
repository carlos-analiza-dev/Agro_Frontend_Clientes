import { TipoAve } from "@/interfaces/enums/animales/animales-enums";
import { TipoAlimentacion } from "./crear-animal.interface";

export enum EtapaAvicola {
  RECEPCION = "Recepcion",
  CRIA = "Cria",
  CRECIMIENTO = "Crecimiento",
  ENGORDE = "Engorde",
  AYUNO = "Ayuno",
}

export interface AvicolaData {
  especie: string;
  fincaId: string;
  razaIds: string[];
  tipo_produccion?: string;
  tipo_alimentacion: TipoAlimentacion[];
  identificador: string;

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
  lote_activo?: boolean;
  fecha_postura?: string | Date;
  etapa_avicola?: EtapaAvicola;
}
