import {
  MetodoSiembra,
  TipoCultivoEnum,
  TipoSistemaRiego,
  TipoSuelo,
} from "@/interfaces/enums/cultivos/tipo-cultivo.enums";

export interface CrearCultivoInterface {
  nombre_cultivo: string;

  variedad?: string;

  tipo_cultivo: TipoCultivoEnum;

  area_sembrada: number;

  unidad_medida: string;

  fecha_siembra: string;

  fecha_cosecha_estimada?: string;

  temporada?: string;

  tipo_suelo: TipoSuelo;

  ph_suelo?: string;

  metodo_siembra: MetodoSiembra;

  sistema_riego: TipoSistemaRiego;

  produccion_estimada?: number;

  unidad_produccion?: string;

  costo_semilla?: number;

  costo_fertilizantes?: number;

  costo_mano_obra?: number;

  otros_costos?: number;

  ingreso_estimado?: number;

  ganancia_estimada?: number;

  fincaId: string;

  isActive?: boolean;
}
