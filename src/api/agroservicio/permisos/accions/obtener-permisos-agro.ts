import { Permiso } from "@/api/permisos/interface/response-permisos.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const obtenerPermisosAgro = async (filters?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/permisos-clientes-agro/activos`;

  const response = await veterinariaAPI.get<Permiso[]>(url, {
    params: filters,
  });
  return response.data;
};

export const obtenerPermisosByRol = async (rolId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-permisos-agro/rol/${rolId}`;

  const response = await veterinariaAPI.get<Permiso[]>(url);
  return response.data;
};
