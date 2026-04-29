import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearActividadInterface } from "../interfaces/crear-actividad.interface";

export const editarActividad = async (
  id: string,
  data: Partial<CrearActividadInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/actividades-diarias/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};
