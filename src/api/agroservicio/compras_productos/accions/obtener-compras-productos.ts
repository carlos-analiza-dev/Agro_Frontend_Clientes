import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseComprasInterface } from "../interface/response-compras.interface";

export const ObtenerCompras = async (
  propietarioId: string,
  limit: number = 10,
  offset: number = 0,
  proveedor: string = "",
  sucursal: string = "",
  tipoPago: string = "",
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-compras-productos/agro-compras/${propietarioId}?limit=${limit}&offset=${offset}&proveedor=${proveedor}&sucursal=${sucursal}&tipoPago=${tipoPago}`;

  const response = await veterinariaAPI.get<ResponseComprasInterface>(url);
  return response.data;
};
