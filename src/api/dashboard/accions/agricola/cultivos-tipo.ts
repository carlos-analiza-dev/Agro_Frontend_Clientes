import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseCultivosTipos } from "../../interfaces/cultivos/response-cultivos-tipos.interface";

export const ObtenerCultivosPorTipo = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/tipos-cultivos`;

  const response = await veterinariaAPI.get<ResponseCultivosTipos[]>(url);
  return response.data;
};
