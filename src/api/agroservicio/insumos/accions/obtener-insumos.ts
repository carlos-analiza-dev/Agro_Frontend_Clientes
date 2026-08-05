import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseAgroInsumos } from "../interfaces/response-agro-insumos.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const obtenerInsumosAgro = async (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro_insumos/insumos/${propietarioId}`;

  const response = await veterinariaAPI.get<ResponseAgroInsumos>(url, {
    params: filters,
  });
  return response.data;
};
