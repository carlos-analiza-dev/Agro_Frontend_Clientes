import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Marca } from "../interface/response-marcas.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const ObtenerMarcasActivas = async (filters?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marcas/activas`;

  const response = await veterinariaAPI.get<Marca[]>(url, {
    params: filters,
  });
  return response.data;
};
