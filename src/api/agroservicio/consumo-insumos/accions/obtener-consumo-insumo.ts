import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseConsumoInsumoInterface } from "../interface/response-consumo-insumo.interface";

export const obtenerConsumoInsumos = async (
  propietarioId: string,
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/consumo-agro-insumos/consumo/${propietarioId}`;

  const response = await veterinariaAPI.get<ResponseConsumoInsumoInterface>(
    url,
    {
      params: filtros,
    },
  );

  return response.data;
};
