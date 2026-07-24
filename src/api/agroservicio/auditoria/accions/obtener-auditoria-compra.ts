import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseAuditoriaCompraInterface } from "../interface/response-auditoria-compras.interface";

export const obtenerAuditoriaCompra = async (filtros?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-compras-productos/auditoria`;

  const response = await veterinariaAPI.get<ResponseAuditoriaCompraInterface>(
    url,
    {
      params: filtros,
    },
  );

  return response.data;
};
