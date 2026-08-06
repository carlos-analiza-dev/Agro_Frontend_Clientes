import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseEscalaInsumos } from "../interfaces/response-escala-insumo.interface";
import { ResponseAllEscalasInsumoInterface } from "../interfaces/response-all-escalas-insumo.interface";

export const ObtenerEscalasInsumo = async (
  limit: number = 10,
  offset: number = 0,
  insumoId: string,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-insumos/insumo/${insumoId}?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseEscalaInsumos>(url);
  return response.data;
};

export const AllEscalasInsumo = async (productoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-insumos/insumo/${productoId}`;

  const response =
    await veterinariaAPI.get<ResponseAllEscalasInsumoInterface[]>(url);
  return response.data;
};
