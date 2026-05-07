import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosUsoEquipos } from "@/interfaces/filtros/filtros-uso-equipos.interface";
import { ResponseUsoEquiposInterface } from "../interfaces/response-uso-equipos.interface";

export const obtenerUsoEquipos = async (filtros?: FiltrosUsoEquipos) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/uso-equipo`;

  const response = await veterinariaAPI.get<ResponseUsoEquiposInterface>(url, {
    params: filtros,
  });

  return response.data;
};
