import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseMovimientosAuditoriaLotes } from "../interface/response-auditoria-movimientos.interface";

export const obtenerAuditoriaMovimientosLote = async (
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-lotes-productos/auditoria`;

  const response = await veterinariaAPI.get<ResponseMovimientosAuditoriaLotes>(
    url,
    {
      params: filtros,
    },
  );

  return response.data;
};
