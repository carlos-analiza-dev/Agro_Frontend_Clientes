import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseSucursalesAgro } from "../interface/response-sucursales-agro.interface";

export const obtenerSucursalesAgro = async (filtros?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-sucursales`;

  const response = await veterinariaAPI.get<ResponseSucursalesAgro>(url, {
    params: filtros,
  });

  return response.data;
};
