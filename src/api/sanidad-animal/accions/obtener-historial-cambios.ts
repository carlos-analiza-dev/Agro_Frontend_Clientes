import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseCambiosSanidadHistorial } from "../interface/response-historial-cambios-sanidad";

export const obtenerEventosHistorialCambios = async (
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sanidad-animal/cambios-fechas`;

  const response = await veterinariaAPI.get<ResponseCambiosSanidadHistorial>(
    url,
    {
      params: filters,
    },
  );

  return response.data;
};
