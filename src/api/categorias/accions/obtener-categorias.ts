import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Categoria } from "../interfaces/response-categorias";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const ObtenerCategorias = async (filters?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/categorias/all`;
  const response = await veterinariaAPI.get<Categoria[]>(url, {
    params: filters,
  });
  return response.data;
};
