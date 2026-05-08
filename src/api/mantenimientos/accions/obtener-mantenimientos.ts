import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosMantenimiento } from "@/interfaces/filtros/filtros-mantenimientos.interface";
import {
  Mantenimiento,
  ResponseMantenimientosInterface,
} from "../interface/response-mantenimientos.interface";

export const obtenerMantenimientos = async (filters?: FiltrosMantenimiento) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/mantenimiento-equipo`;
  const response = await veterinariaAPI.get<ResponseMantenimientosInterface>(
    url,
    {
      params: filters,
    },
  );
  return response.data;
};

export const obtenerMantenimientoById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/mantenimiento-equipo/${id}`;
  const response = await veterinariaAPI.get<Mantenimiento>(url);
  return response.data;
};
