import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseDescuentoInterface } from "../interface/response-descuento-producto.interface";

export const ObtenerDescuentoProducto = async (productoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-agro-producto/producto/${productoId}`;

  const response = await veterinariaAPI.get<ResponseDescuentoInterface[]>(url);
  return response.data;
};
