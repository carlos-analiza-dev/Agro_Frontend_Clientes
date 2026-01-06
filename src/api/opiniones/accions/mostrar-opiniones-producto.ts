import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseOpinionesByProducto } from "../interfaces/response-opiniones.interface";

export const obtenerOpinionesByProducto = async (
  id: string,
  limit?: number,
  offset?: number
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/producto-opiniones/producto/${id}?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseOpinionesByProducto>(url);
  return response.data;
};
