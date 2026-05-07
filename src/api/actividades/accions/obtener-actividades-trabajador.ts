import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Actividade } from "../interfaces/response-actividades.interface";

export const obtenerActividadesByTrabajador = async (
  id: string,
  fecha?: string,
) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/actividades-diarias/trabajador/${id}`;

  if (fecha && fecha !== "undefined") {
    url += `?fecha=${fecha}`;
  }
  const response = await veterinariaAPI.get<Actividade[]>(url);

  return response.data;
};
