import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseMovimientosLotesInterface } from "../interface/response-movimientos-lotes.interface";

export const obtenerMovimientosLotes = async (
  propietariId: string,
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/movimientos-agro-lote/agroservicio/${propietariId}`;
  const response = await veterinariaAPI.get<ResponseMovimientosLotesInterface>(
    url,
    {
      params: filters,
    },
  );
  return response.data;
};
