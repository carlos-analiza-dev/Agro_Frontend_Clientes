import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseEstadosPlanilla } from "../../interfaces/planilla-dashboard/resumen-estados.interface";

export const ObtenerResumenEstados = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/resumen-estados`;

  const response = await veterinariaAPI.get<ResponseEstadosPlanilla[]>(url);
  return response.data;
};
