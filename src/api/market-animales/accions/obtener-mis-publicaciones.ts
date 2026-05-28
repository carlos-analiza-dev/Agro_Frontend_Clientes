import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseMISPublicaciones } from "../interfaces/response-publicaciones.interface";

export const obtenerMisPublicaciones = async (
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marketplace-animales/mis-publicaciones`;

  const response = await veterinariaAPI.get<ResponseMISPublicaciones>(url, {
    params: filters,
  });

  return response.data;
};
