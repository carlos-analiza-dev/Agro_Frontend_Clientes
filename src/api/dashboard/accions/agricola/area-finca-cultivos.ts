import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseAreaCultivoFinca } from "../../interfaces/cultivos/response-area-finca.interface";

export const ObtenerAreaCultivoByFinca = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/area-por-finca`;

  const response = await veterinariaAPI.get<ResponseAreaCultivoFinca[]>(url);
  return response.data;
};
