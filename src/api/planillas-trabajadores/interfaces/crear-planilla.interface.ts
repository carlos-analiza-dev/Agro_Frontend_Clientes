import { TipoPeriodoPago } from "@/interfaces/enums/planillas.enums";

export interface CrearPlanillaInterface {
  nombre: string;
  descripcion: string;
  tipoPeriodo: TipoPeriodoPago;
  observaciones?: string;
  diasPeriodo: number;
  fechaInicio: string;
  fechaFin: string;
  fechaPago: string;
}
