import { EstadoServicio } from "@/interfaces/enums/servicios-reproductivos.enum";

export const estadoReproductivo = [
  {
    id: 1,
    label: "Programado",
    value: EstadoServicio.PROGRAMADO,
  },
  {
    id: 2,
    label: "Realizado",
    value: EstadoServicio.REALIZADO,
  },
  {
    id: 3,
    label: "Fallido",
    value: EstadoServicio.FALLIDO,
  },
  {
    id: 4,
    label: "Cancelado",
    value: EstadoServicio.CANCELADO,
  },
];
