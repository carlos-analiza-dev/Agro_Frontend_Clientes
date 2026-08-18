import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseComprasProductosClienteInterface } from "../interfaces/response-productos-mayor-compras.interface";

export const obtenerProductosFrecuentes = async (
  clienteId: string,
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-facturacion/cliente/${clienteId}`;

  const response =
    await veterinariaAPI.get<ResponseComprasProductosClienteInterface>(url, {
      params: filtros,
    });

  return response.data;
};
