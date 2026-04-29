export interface ResponseResumenHoras {
  totalHorasDiurnas: string | number | null;
  totalHorasNocturnas: string | number | null;
  totalHorasFestivas: string | number | null;
  montoTotalHorasExtras: string | number | null;
  trabajadoresConHorasExtras: string | number;
  totalHorasExtras: number;
}
