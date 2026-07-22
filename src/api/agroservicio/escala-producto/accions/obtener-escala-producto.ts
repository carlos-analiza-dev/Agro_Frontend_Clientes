import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseEscalasProductoInterface } from "../interfaces/response-escala-producto.interface";
import { ResponseAllEscalasProductos } from "../interfaces/response-all-escala-producto.interface";

export const ObtenerEscalasProducto = async (
  limit: number = 10,
  offset: number = 0,
  productoId: string,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-producto/producto/${productoId}?limit=${limit}&offset=${offset}`;

  const response =
    await veterinariaAPI.get<ResponseEscalasProductoInterface>(url);
  return response.data;
};

export const AllEscalasProducto = async (productoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-producto/producto-escalas/${productoId}`;

  const response = await veterinariaAPI.get<ResponseAllEscalasProductos[]>(url);
  return response.data;
};
