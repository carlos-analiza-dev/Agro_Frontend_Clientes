import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseSearchInterface } from "../interfaces/response-search.interface";

export const searchMarketPlace = async (filtros?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marketplace-animales/search`;

  const response = await veterinariaAPI.get<ResponseSearchInterface[]>(url, {
    params: filtros,
  });

  return response.data;
};
