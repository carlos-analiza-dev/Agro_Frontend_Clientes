import {
  DiaSemana,
  TipoTrabajador,
} from "@/interfaces/enums/config-trabajadores.enums";

export const diasSemanaOptions = [
  { value: DiaSemana.LUNES },
  { value: DiaSemana.MARTES },
  { value: DiaSemana.MIERCOLES },
  { value: DiaSemana.JUEVES },
  { value: DiaSemana.VIERNES },
  { value: DiaSemana.SABADO },
  { value: DiaSemana.DOMINGO },
];

export const tipoTrabajadorOptions = [
  { value: TipoTrabajador.PERMANENTE },
  { value: TipoTrabajador.TEMPORAL },
  { value: TipoTrabajador.PARCIAL },
];
