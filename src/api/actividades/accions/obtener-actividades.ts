import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosActividades } from "@/interfaces/filtros/filters-actividades.interface";
import { ResponseActividadesInterface } from "../interfaces/response-actividades.interface";

export const obtenerActividades = async (filtros?: FiltrosActividades) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/actividades-diarias`;

  const response = await veterinariaAPI.get<ResponseActividadesInterface>(url, {
    params: filtros,
  });

  return response.data;
};
