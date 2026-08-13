import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseFormasPagoInterface } from "../interface/response-ventas-pagos.interface";

export const obtenerFormasPago = async (filters?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/metricas-agro/formas-pago`;

  const response = await veterinariaAPI.get<ResponseFormasPagoInterface[]>(
    url,
    {
      params: filters,
    },
  );
  return response.data;
};
