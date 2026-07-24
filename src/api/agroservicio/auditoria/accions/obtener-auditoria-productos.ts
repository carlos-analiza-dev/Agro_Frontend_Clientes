import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseAuditoriaProductos } from "../interface/response-auditoria-productos.interface";

export const obtenerAuditoriaProductos = async (
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-productos/auditoria`;

  const response = await veterinariaAPI.get<ResponseAuditoriaProductos>(url, {
    params: filtros,
  });

  return response.data;
};
