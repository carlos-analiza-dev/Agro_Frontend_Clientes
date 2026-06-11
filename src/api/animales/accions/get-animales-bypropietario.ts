import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import {
  Animal,
  ResponseAnimalesByPropietario,
} from "../interfaces/response-animales.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const ObtenerAnimalesByPropietario = async (
  propietarioId: string,
  fincaId?: string,
  especieId?: string,
  identificador?: string,
  pageParams?: { limit: number; offset: number },
): Promise<ResponseAnimalesByPropietario> => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/propietario-animales/${propietarioId}`;

  const params = new URLSearchParams();

  if (fincaId) {
    params.append("fincaId", fincaId);
  }

  if (especieId) {
    params.append("especieId", especieId);
  }

  if (identificador) {
    params.append("identificador", identificador);
  }

  if (pageParams) {
    params.append("limit", pageParams.limit.toString());
    params.append("offset", pageParams.offset.toString());
  }

  if ([...params].length > 0) {
    url += `?${params.toString()}`;
  }

  const response = await veterinariaAPI.get<ResponseAnimalesByPropietario>(url);
  return response.data;
};

export const ObtenerAnimales = async (filters?: PaginationInterface) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/propietario`;

  const response = await veterinariaAPI.get<Animal[]>(url, {
    params: filters,
  });
  return response.data;
};
