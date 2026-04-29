import { MetodoPago } from "@/interfaces/enums/planillas.enums";

export interface ResponseResumenMetodosPagos {
  metodoPago: MetodoPago;
  cantidadPagos: number;
  totalPagado: number;
  promedioPorPago: number;
  porcentajeDelTotal: string;
}
