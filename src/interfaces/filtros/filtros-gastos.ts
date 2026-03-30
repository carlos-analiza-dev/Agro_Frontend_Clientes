export interface FiltrosGastos {
  fincaId?: string;
  especieId?: string;
  categoria: string;
  metodo_pago: string;
  fechaInicio?: string;
  fechaFin?: string;
  offset?: number;
  limit?: number;
}
