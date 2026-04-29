import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosPlanilla } from "@/interfaces/filtros/filters-planilla";
import { ResponseResumenMetodosPagos } from "../../interfaces/planilla-dashboard/response-metodos-pagos.interface";

export const ObtenerResumenMetodosPagos = async (filters?: FiltrosPlanilla) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/metodos-pago`;

  const response = await veterinariaAPI.get<ResponseResumenMetodosPagos[]>(
    url,
    {
      params: filters,
    },
  );
  return response.data;
};
