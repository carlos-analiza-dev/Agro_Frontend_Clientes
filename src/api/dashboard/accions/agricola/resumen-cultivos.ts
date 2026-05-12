import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseResumenCultivos } from "../../interfaces/cultivos/resumen-cultivos.interface";

export const ObtenerResumenCultivos = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/resumen-cultivos`;

  const response = await veterinariaAPI.get<ResponseResumenCultivos>(url);
  return response.data;
};
