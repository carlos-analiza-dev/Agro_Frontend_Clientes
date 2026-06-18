import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseAnunciosInterface } from "../interface/response-anuncios.interface";

export const obtenerAnuncios = async (filtros?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/anuncios-principales/clients`;

  const response = await veterinariaAPI.get<ResponseAnunciosInterface[]>(url, {
    params: filtros,
  });

  return response.data;
};
