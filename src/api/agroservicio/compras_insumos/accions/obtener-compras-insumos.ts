import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseInsumosinteface } from "../interfaces/response-compras-insumos.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const ObtenerComprasAgroInsumos = async (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/compra-agro-insumos/compra/${propietarioId}`;

  const response = await veterinariaAPI.get<ResponseInsumosinteface>(url, {
    params: filters,
  });
  return response.data;
};
