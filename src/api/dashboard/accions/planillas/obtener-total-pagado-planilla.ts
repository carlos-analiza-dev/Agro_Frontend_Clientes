import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseTotalPagadoPlanilla } from "../../interfaces/planilla-dashboard/response-total-pagado.interface";
import { FiltrosPlanilla } from "@/interfaces/filtros/filters-planilla";

export const ObtenerTotalPagadoPlanilla = async (filters?: FiltrosPlanilla) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/total-pagado`;

  const response = await veterinariaAPI.get<ResponseTotalPagadoPlanilla>(url, {
    params: filters,
  });
  return response.data;
};
