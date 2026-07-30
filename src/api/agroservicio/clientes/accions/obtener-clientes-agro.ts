import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseClientesAgro } from "../interfaces/response-clientes-ago.interface";

export const obtenerClientesAgro = async (
  propietarioId: string,
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-clientes/agroservicio/${propietarioId}`;

  const response = await veterinariaAPI.get<ResponseClientesAgro>(url, {
    params: filtros,
  });

  return response.data;
};
