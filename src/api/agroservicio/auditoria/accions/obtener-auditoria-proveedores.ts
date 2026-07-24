import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseAuditoriaProveedores } from "../interface/response-auditoria-proveedores.interface";

export const obtenerAuditoriaProveedores = async (
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-proveedores/auditoria`;

  const response = await veterinariaAPI.get<ResponseAuditoriaProveedores>(url, {
    params: filtros,
  });

  return response.data;
};
