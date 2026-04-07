export interface RentabilidadGeneralInterface {
  totalIngresos: number;
  totalGastos: number;
  rentabilidadNeta: number;
  margenRentabilidad: number;
  roi: number;
  mejorMes: OrMes;
  peorMes: OrMes;
}

export interface OrMes {
  periodo: string;
  ingresos: number;
  gastos: number;
  rentabilidad: number;
  margen: number;
}
