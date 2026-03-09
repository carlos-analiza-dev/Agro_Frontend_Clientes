import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseInventarioInterface } from "../interfaces/response-inventario.interface";

export const ObtenerInventarioProductos = async (
  limit: number = 10,
  offset: number = 0,
  fincaId: string,
) => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString(),
    fincaId: fincaId.toString(),
  };

  const queryString = new URLSearchParams(params).toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/inventario-productos-ganaderia?${queryString}`;

  const response = await veterinariaAPI.get<ResponseInventarioInterface>(url);
  return response.data;
};
