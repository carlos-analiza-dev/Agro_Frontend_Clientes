import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearActividadInterface } from "../interfaces/crear-actividad.interface";

export const crearActividad = async (data: CrearActividadInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/actividades-diarias`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
