import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseEstadosFactura } from "../interface/response-estados-factura.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const obtenerEstadosFactura = async (filters?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/metricas-agro/estados`;

  const response = await veterinariaAPI.get<ResponseEstadosFactura[]>(url, {
    params: filters,
  });
  return response.data;
};
