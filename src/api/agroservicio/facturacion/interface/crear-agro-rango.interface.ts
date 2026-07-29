export interface CrearRangoAgroInterface {
  cai: string;
  prefijo: string;
  rango_inicial: number;
  rango_final: number;
  fecha_recepcion: string;
  fecha_limite_emision: string;
  is_active?: boolean;
}
