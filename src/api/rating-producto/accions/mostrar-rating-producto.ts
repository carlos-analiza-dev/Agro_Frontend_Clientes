import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseRatingProductos } from "../interfaces/response-rating-producto.interface";

export const obtenerRatingByProducto = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/producto-rating-resumen/producto/${id}`;

  const response = await veterinariaAPI.get<ResponseRatingProductos>(url);
  return response.data;
};
