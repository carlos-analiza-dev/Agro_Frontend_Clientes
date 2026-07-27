import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseExistenciaProductosInterface } from "../interfaces/response-existencia-productos.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const obtenerExistenciaProductos = async (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-lotes-productos/existencias/${propietarioId}`;

  const response = await veterinariaAPI.get<
    ResponseExistenciaProductosInterface[]
  >(url, {
    params: filters,
  });
  return response.data;
};
