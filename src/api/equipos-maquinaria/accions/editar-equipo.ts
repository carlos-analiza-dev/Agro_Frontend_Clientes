import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEquipoInterface } from "../interface/crear-equipo.interface";

export const editarEquipo = async (
  id: string,
  data: Partial<CrearEquipoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/equipo-maquinaria/${id}`;
  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
