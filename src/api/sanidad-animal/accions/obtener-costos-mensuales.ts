import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseCostosMensuales } from "../interface/response-costos-mensuales.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const obtenerCostosMensuales = async (filters?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sanidad-animal/costos`;

  const response = await veterinariaAPI.get<ResponseCostosMensuales[]>(url, {
    params: filters,
  });
  return response.data;
};
