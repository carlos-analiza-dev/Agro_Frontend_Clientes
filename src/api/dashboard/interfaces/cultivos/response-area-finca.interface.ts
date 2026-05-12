import { UnidadMedida } from "@/helpers/funciones/cultivos/unidades-config";

export interface ResponseAreaCultivoFinca {
  finca: string;
  area_total: string;
  unidad_medida: UnidadMedida;
}
