import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosEquipos } from "@/interfaces/filtros/filtros-equipos";
import { ResponseEquiposInterface } from "../interface/response-equipos.interface";

export const obtenerEquipos = async (filters?: FiltrosEquipos) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/equipo-maquinaria`;
  const response = await veterinariaAPI.get<ResponseEquiposInterface>(url, {
    params: filters,
  });
  return response.data;
};
