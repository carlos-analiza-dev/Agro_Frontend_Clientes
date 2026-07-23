import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import {
  AgroProducto,
  ResponseAgroProductosInterface,
} from "../interface/response-productos-agro.interface";

export const obtenerProductosAgro = async (
  propietarioId: string,
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-productos/agroservicio/${propietarioId}`;

  const response = await veterinariaAPI.get<ResponseAgroProductosInterface>(
    url,
    {
      params: filtros,
    },
  );

  return response.data;
};

export const obtenerTodosProductosAgro = async (propietarioId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-productos/agroservicio/todos/${propietarioId}`;

  const response = await veterinariaAPI.get<AgroProducto[]>(url);

  return response.data;
};
