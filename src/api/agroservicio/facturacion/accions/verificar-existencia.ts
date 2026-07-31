import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseExistenciaInterface } from "../interface/verificar-existencia.interface";

export const VerificarExistencia = async (facturaId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-facturacion/${facturaId}/verificar-existencia`;

  const response = await veterinariaAPI.get<ResponseExistenciaInterface>(url);
  return response.data;
};
