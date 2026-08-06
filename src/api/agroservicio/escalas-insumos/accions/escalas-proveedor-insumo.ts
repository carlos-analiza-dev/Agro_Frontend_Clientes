import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseAllEscalasInsumoInterface } from "../interfaces/response-all-escalas-insumo.interface";

export const ObtenerEscalasProveedorAndInsumo = async (
  proveedorId: string,
  insumoId: string,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-insumos/proveedor/${proveedorId}/insumo/${insumoId}`;

  const response =
    await veterinariaAPI.get<ResponseAllEscalasInsumoInterface[]>(url);
  return response.data;
};
