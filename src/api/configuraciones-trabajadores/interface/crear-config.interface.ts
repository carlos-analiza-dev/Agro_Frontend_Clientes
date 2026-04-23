import {
  DiaSemana,
  TipoTrabajador,
} from "@/interfaces/enums/config-trabajadores.enums";

export interface CrearConfigTrabajadorInterface {
  trabajadorId: string;
  fechaContratacion: string;

  tipoTrabajador: TipoTrabajador;

  diaDescanso?: DiaSemana;
  horaEntrada?: string;
  horaSalida?: string;
  diasLaborales?: DiaSemana[];

  cargo?: string;

  salarioDiario: number;

  factorHoraExtraDiurnas: number;
  factorHoraExtraNocturnas: number;
  factorHoraExtraFestivas: number;

  diasTrabajadosSemanal: number;
  horasJornadaSemanal: number;

  bonificacionesFijas?: CionesFija[];
  deduccionesFijas?: CionesFija[];

  activo: boolean;

  fechaBaja?: string;
  motivoBaja?: string;
}

export interface CionesFija {
  concepto: string;
  montoMensual: number;
}
