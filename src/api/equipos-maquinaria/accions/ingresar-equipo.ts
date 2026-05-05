import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEquipoInterface } from "../interface/crear-equipo.interface";

export const ingresarEquipo = async (data: CrearEquipoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/equipo-maquinaria`;
  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
