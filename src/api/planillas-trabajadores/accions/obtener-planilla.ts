import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosPlanilla } from "@/interfaces/filtros/filters-planilla";
import { ResponsePlanillaInterface } from "../interfaces/response-planillas.interface";

export const obtenerPlanillasTrabajadores = async (
  filtros?: FiltrosPlanilla,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/planilla-trabajadores`;

  const response = await veterinariaAPI.get<ResponsePlanillaInterface>(url, {
    params: filtros,
  });

  return response.data;
};
