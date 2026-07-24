import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseLotesByProductoInterface } from "../interface/response-lotes-producto.interface";

export const ObtenerLotesProducto = async (productoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-lotes-productos/producto/${productoId}`;

  const response =
    await veterinariaAPI.get<ResponseLotesByProductoInterface[]>(url);
  return response.data;
};

export default ObtenerLotesProducto;
