import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseDetailsPlanilla } from "../interfaces/response-details-planilla.interface";

export const obtenerDetallesPlanillasTrabajadores = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/planilla-trabajadores/${id}/detalle`;

  const response = await veterinariaAPI.get<ResponseDetailsPlanilla>(url);

  return response.data;
};
