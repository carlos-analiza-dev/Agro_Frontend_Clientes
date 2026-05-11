import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltersCultivos } from "@/interfaces/filtros/cultivos-filters.interface";
import {
  Cultivo,
  ResponseCultivosInterface,
} from "../interface/response-cultivos.interface";

export const obtenerCultivos = async (filtros?: FiltersCultivos) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cultivos`;

  const response = await veterinariaAPI.get<ResponseCultivosInterface>(url, {
    params: filtros,
  });

  return response.data;
};

export const obtenerCultivoById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cultivos/${id}`;

  const response = await veterinariaAPI.get<Cultivo>(url);

  return response.data;
};
