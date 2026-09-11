import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseMarketAnimalesInterface } from "../interfaces/response-market-animales.interface";

export const obtenerAllPublicaciones = async (
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marketplace-animales/publics`;

  const response = await veterinariaAPI.get<ResponseMarketAnimalesInterface>(
    url,
    {
      params: filtros,
    },
  );

  return response.data;
};
