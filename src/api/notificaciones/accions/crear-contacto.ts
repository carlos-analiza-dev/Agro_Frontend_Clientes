import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearContactoNotificacionInterface } from "../interface/crear-contacto.notificacion";

export const CrearContactoNotificacion = async (
  data: CrearContactoNotificacionInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/notificaciones-admins`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
