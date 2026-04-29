import { MetodoPago } from "../enums/planillas.enums";

export interface FiltrosPlanilla {
  offset?: number;
  limit?: number;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  mes?: string;
  metodoPago?: MetodoPago;
}
