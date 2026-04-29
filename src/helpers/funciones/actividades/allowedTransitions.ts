import { EstadoActividad } from "@/interfaces/enums/actividaes.enums";

export const allowedTransitions: Record<EstadoActividad, EstadoActividad[]> = {
  [EstadoActividad.PENDIENTE]: [
    EstadoActividad.EN_PROCESO,
    EstadoActividad.CANCELADA,
  ],
  [EstadoActividad.EN_PROCESO]: [
    EstadoActividad.COMPLETADA,
    EstadoActividad.CANCELADA,
  ],
  [EstadoActividad.COMPLETADA]: [],
  [EstadoActividad.CANCELADA]: [],
};
