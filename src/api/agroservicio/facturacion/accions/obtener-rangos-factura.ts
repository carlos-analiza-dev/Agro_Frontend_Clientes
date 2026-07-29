import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseAgroRangosFacturaInterface } from "../interface/response-agro-rangos-factura.interface";

export const obtenerRangosAgroFacturas = async (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-rango-factura/agroservicio/${propietarioId}`;

  const response = await veterinariaAPI.get<ResponseAgroRangosFacturaInterface>(
    url,
    {
      params: filters,
    },
  );
  return response.data;
};
