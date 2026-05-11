import { TipoCultivoEnum } from "@/interfaces/enums/cultivos/tipo-cultivo.enums";

export interface CrearCultivoInterface {
  nombre_cultivo: string;
  variedad: string;
  tipo_cultivo: TipoCultivoEnum;
  area_sembrada: number;
  fecha_siembra: string;
  fecha_cosecha_estimada: string;
  temporada: string;
  fincaId: string;
  isActive?: boolean;
}
