import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { TipoCultivoEnum } from "@/interfaces/enums/cultivos/tipo-cultivo.enums";

export interface ResponseCultivosInterface {
  cultivos: Cultivo[];
  total: number;
  limit: number;
  offset: number;
}

export interface Cultivo {
  id: string;
  nombre_cultivo: string;
  tipo_cultivo: TipoCultivoEnum;
  variedad: string;
  area_sembrada: string;
  unidad_medida: string;
  fecha_siembra: string;
  fecha_cosecha_estimada: string;
  temporada: string;
  isActive: boolean;
  finca: Finca;
}
