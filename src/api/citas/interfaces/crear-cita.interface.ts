export interface CrearCitaInterface {
  medicoId: string;
  animalesId: string[];
  fincaId: string;
  subServicioId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracion: number;
  cantidadAnimales?: number;
  totalPagar: number;
  totalFinal?: number;
  estado?: string;
}
