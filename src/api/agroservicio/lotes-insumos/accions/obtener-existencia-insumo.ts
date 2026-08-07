import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseExistenciaAgroInsumo } from "../interface/response-existencia-insumo";

export const obtenerExistenciaInsumos = async (
  sucursalId: string,
  insumoId: string,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/lotes-agro-insumos/cantidad/${sucursalId}/${insumoId}`;

  const response = await veterinariaAPI.get<ResponseExistenciaAgroInsumo>(url);
  return response.data;
};
