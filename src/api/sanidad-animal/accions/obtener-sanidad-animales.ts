import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseSanidadAnimalInterface } from "../interface/response-sanidad-animal.interface";

export const obtenerSanidadAnimal = async (filters?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sanidad-animal`;

  const response = await veterinariaAPI.get<ResponseSanidadAnimalInterface>(
    url,
    {
      params: filters,
    },
  );

  return response.data;
};

export const obtenerEventosEliminados = async (
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sanidad-animal/eliminados`;

  const response = await veterinariaAPI.get<ResponseSanidadAnimalInterface>(
    url,
    {
      params: filters,
    },
  );

  return response.data;
};
