import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import {
  MetodoSiembra,
  TipoCultivoEnum,
  TipoSistemaRiego,
  TipoSuelo,
} from "@/interfaces/enums/cultivos/tipo-cultivo.enums";

export interface ResponseCultivosInterface {
  cultivos: Cultivo[];
  total: number;
  limit: number;
  offset: number;
}

export interface Cultivo {
  id: string;

  nombre_cultivo: string;

  variedad?: string;

  tipo_cultivo: TipoCultivoEnum;

  area_sembrada: string;

  unidad_medida: string;

  fecha_siembra: string;

  fecha_cosecha_estimada?: string;

  temporada?: string;

  tipo_suelo: TipoSuelo;

  ph_suelo?: string;

  metodo_siembra: MetodoSiembra;

  sistema_riego: TipoSistemaRiego;

  produccion_estimada?: string;

  unidad_produccion?: string;

  costo_semilla?: string;

  costo_fertilizantes?: string;

  costo_mano_obra?: string;

  otros_costos?: string;

  ingreso_estimado?: string;

  ganancia_estimada?: string;

  isActive: boolean;

  finca: Finca;
}
