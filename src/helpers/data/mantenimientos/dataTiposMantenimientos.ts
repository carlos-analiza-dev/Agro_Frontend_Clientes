import { TipoMantenimiento } from "@/interfaces/enums/maquinaria/maquinaria.enums";

export const tiposMamtenimientoData = [
  {
    id: 1,
    value: TipoMantenimiento.CORRECTIVO,
    label: "Correctivo",
  },
  {
    id: 2,
    value: TipoMantenimiento.PREVENTIVO,
    label: "Preventivo",
  },
];
