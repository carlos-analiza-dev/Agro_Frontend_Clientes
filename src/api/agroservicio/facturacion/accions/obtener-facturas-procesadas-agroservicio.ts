import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { AgroFactura } from "../interface/response-facturas-agro.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const ObtenerFacturasProcesadas = async (
  propietarioid: string,
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-facturacion/procesadas/${propietarioid}`;

  const response = await veterinariaAPI.get<AgroFactura[]>(url, {
    params: filtros,
  });
  return response.data;
};
