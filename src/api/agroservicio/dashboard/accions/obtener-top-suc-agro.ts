import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseMejoresSucursales } from "../interface/response-sucursal-mas-ventas.interface";

export const obtenerTopSucursalesAgro = async (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/metricas-agro/sucursales/${propietarioId}`;

  const response = await veterinariaAPI.get<ResponseMejoresSucursales[]>(url, {
    params: filters,
  });
  return response.data;
};
