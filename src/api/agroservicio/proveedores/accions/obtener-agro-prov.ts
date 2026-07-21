import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import {
  ProveedoreAgro,
  ResponseAgroProveedores,
} from "../interface/response-agro-proveedores.interface";

export const obtenerProveedoresAgro = async (
  propietarioId: string,
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-proveedores/agroservicio/${propietarioId}`;

  const response = await veterinariaAPI.get<ResponseAgroProveedores>(url, {
    params: filtros,
  });

  return response.data;
};

export const obtenerAllProveedoresAgro = async (propietarioId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-proveedores/activos/${propietarioId}`;

  const response = await veterinariaAPI.get<ProveedoreAgro[]>(url);

  return response.data;
};
