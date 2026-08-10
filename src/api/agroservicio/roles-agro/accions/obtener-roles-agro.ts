import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseRolesAgroInterface } from "../interface/obtener-roles-agro.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const obtenerRoleslesAgro = async (filters?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-agro`;

  const response = await veterinariaAPI.get<ResponseRolesAgroInterface[]>(url, {
    params: filters,
  });

  return response.data;
};
