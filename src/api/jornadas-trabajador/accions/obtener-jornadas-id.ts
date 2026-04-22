import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Jornada } from "../interface/response-jornadas.interface";

export const obtenerJornadasTrabajadoresById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/jornada-trabajadores/${id}`;

  const response = await veterinariaAPI.get<Jornada>(url);

  return response.data;
};
