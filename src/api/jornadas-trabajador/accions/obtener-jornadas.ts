import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosJornadas } from "@/interfaces/filtros/filtros-jornadas.interface";
import { ResponseJornadasTrabajadoresInterface } from "../interface/response-jornadas.interface";

export const obtenerJornadasTrabajadores = async (
  filtros?: FiltrosJornadas,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/jornada-trabajadores`;

  const response =
    await veterinariaAPI.get<ResponseJornadasTrabajadoresInterface>(url, {
      params: filtros,
    });

  return response.data;
};
