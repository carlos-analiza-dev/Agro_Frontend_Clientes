import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosMantenimiento } from "@/interfaces/filtros/filtros-mantenimientos.interface";
import { ResponseMantenimientosInterface } from "../interface/response-mantenimientos.interface";

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
