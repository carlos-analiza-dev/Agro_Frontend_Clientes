import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseNotaCreditoInterface } from "../interface/response-nota-credito.interface";

export const obtenerNotaCredito = async (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/nota-credito-agro/agroservicio/${propietarioId}`;

  const response = await veterinariaAPI.get<ResponseNotaCreditoInterface>(url, {
    params: filters,
  });
  return response.data;
};
