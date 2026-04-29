import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosPlanilla } from "@/interfaces/filtros/filters-planilla";
import { ResponseResumenHoras } from "../../interfaces/planilla-dashboard/response-resumen-horas.interface";

export const ObtenerResumenHorasExtra = async (filters?: FiltrosPlanilla) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/horas-extras`;

  const response = await veterinariaAPI.get<ResponseResumenHoras>(url, {
    params: filters,
  });
  return response.data;
};
