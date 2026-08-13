import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseClientesComprasInterface } from "../interface/response-clientes-compras.interface";

export const obtenerMetricasClientesMasCompras = async (
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/metricas-agro/clientes`;

  const response = await veterinariaAPI.get<ResponseClientesComprasInterface[]>(
    url,
    {
      params: filters,
    },
  );
  return response.data;
};
