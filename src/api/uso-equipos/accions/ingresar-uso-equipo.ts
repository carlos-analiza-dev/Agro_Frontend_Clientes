import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { IngresarUsoEquipoInterface } from "../interfaces/crear-uso-equipo.interface";

export const ingresarUso = async (data: IngresarUsoEquipoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/uso-equipo`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
