export interface CrearConfigTrabajadorInterface {
  trabajadorId: string;
  fechaContratacion: string;
  cargo: string;
  salarioDiario: number;
  factorHoraExtraDiurnas: number;
  factorHoraExtraNocturnas: number;
  factorHoraExtraFestivas: number;
  diasTrabajadosSemanal: number;
  horasJornadaSemanal: number;
  bonificacionesFijas: CionesFija[];
  deduccionesFijas: CionesFija[];
  activo: boolean;
}

export interface CionesFija {
  concepto: string;
  montoMensual: number;
}
