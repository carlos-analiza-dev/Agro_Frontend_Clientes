import {
  DiaSemana,
  TipoTrabajador,
} from "@/interfaces/enums/config-trabajadores.enums";

export const diasSemanaOptions = [
  { value: DiaSemana.LUNES, label: "Lunes" },
  { value: DiaSemana.MARTES, label: "Martes" },
  { value: DiaSemana.MIERCOLES, label: "Miércoles" },
  { value: DiaSemana.JUEVES, label: "Jueves" },
  { value: DiaSemana.VIERNES, label: "Viernes" },
  { value: DiaSemana.SABADO, label: "Sábado" },
  { value: DiaSemana.DOMINGO, label: "Domingo" },
];

export const tipoTrabajadorOptions = [
  {
    value: TipoTrabajador.PERMANENTE,
    label: "Permanente",
    description: "Cumple horario 6 días a la semana",
  },
  {
    value: TipoTrabajador.TEMPORAL,
    label: "Temporal",
    description: "Similar al permanente, sin permanencia",
  },
  {
    value: TipoTrabajador.PARCIAL,
    label: "Parcial",
    description: "No trabaja todos los días",
  },
];
