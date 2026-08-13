import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { MetricaResumenInterface } from "../interface/response-facturas-agro.interface";

export const obtenerMetricasResFacturas = async (
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/metricas-agro/resumen`;

  const response = await veterinariaAPI.get<MetricaResumenInterface>(url, {
    params: filters,
  });
  return response.data;
};
