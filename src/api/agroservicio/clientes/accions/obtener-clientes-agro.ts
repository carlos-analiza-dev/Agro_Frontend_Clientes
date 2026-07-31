import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import {
  ClienteAgro,
  ResponseClientesAgro,
} from "../interfaces/response-clientes-ago.interface";

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

export const obtenerClientesAgroActivos = async (propietarioId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-clientes/agroservicio/activos/${propietarioId}`;

  const response = await veterinariaAPI.get<ClienteAgro[]>(url);

  return response.data;
};
