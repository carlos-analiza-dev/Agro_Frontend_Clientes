import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { TipoProducto } from "../interface/response-tipo-producto.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const ObtenerTipoProductoBySubCat = async (
  id: string,
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/tipo-producto/subcategoria/${id}`;

  const response = await veterinariaAPI.get<TipoProducto[]>(url, {
    params: filters,
  });
  return response.data;
};
