import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import {
  ResponseSucursalesAgro,
  SucursaleAgro,
} from "../interface/response-sucursales-agro.interface";

export const obtenerSucursalesAgro = async (filtros?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-sucursales`;

  const response = await veterinariaAPI.get<ResponseSucursalesAgro>(url, {
    params: filtros,
  });

  return response.data;
};

export const obtenerTodasSucursalesAgro = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-sucursales/sucursales`;

  const response = await veterinariaAPI.get<SucursaleAgro[]>(url);

  return response.data;
};

export const obtenerSucursalByEmpleado = async (empleadoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-sucursales/empleado/${empleadoId}`;

  const response = await veterinariaAPI.get<SucursaleAgro>(url);

  return response.data;
};
