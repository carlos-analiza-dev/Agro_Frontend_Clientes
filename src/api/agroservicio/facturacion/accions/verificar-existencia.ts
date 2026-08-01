import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseExistenciaInterface } from "../interface/verificar-existencia.interface";

export const VerificarExistencia = async (
  facturaId: string,
  sucursalId: string,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-facturacion/${facturaId}/${sucursalId}/verificar-existencia`;

  const response = await veterinariaAPI.get<ResponseExistenciaInterface>(url);
  return response.data;
};
