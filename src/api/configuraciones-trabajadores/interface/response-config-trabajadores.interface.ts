import {
  DiaSemana,
  TipoTrabajador,
} from "@/interfaces/enums/config-trabajadores.enums";

export interface ResponseConfigTrabajadoresInterface {
  configuraciones: Configuraciones[];
  total: number;
  limit: number;
  offset: number;
}

export interface Configuraciones {
  id: string;

  trabajadorId: string;
  propietarioId: string;

  fechaContratacion: string;

  tipoTrabajador: TipoTrabajador;

  diaDescanso?: DiaSemana;
  horaEntrada?: string;
  horaSalida?: string;
  diasLaborales?: DiaSemana[];

  cargo?: string;

  salarioDiario: string;

  factorHoraExtraDiurnas?: number;
  factorHoraExtraNocturnas?: number;
  factorHoraExtraFestivas?: number;

  horasJornadaSemanal: number;
  diasTrabajadosSemanal: number;

  bonificacionesFijas?: CionesFija[];
  deduccionesFijas?: CionesFija[];

  activo: boolean;

  fechaBaja?: string | null;
  motivoBaja?: string | null;

  createdAt: string;
  updatedAt: string;

  trabajador: Propietario;
  propietario: Propietario;
}

export interface CionesFija {
  concepto: string;
  montoMensual: number;
}

export interface Propietario {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  verified: boolean;
  rol: string;
  isActive: boolean;
  createdAt: Date;
  propietarioId: null | string;
}
