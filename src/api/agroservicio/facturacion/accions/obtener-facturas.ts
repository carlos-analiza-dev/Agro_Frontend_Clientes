import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseFacturasAgroInterface } from "../interface/response-facturas-agro.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const obtenerAgroFacturas = async (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-facturacion/agroservicio/${propietarioId}`;

  const response = await veterinariaAPI.get<ResponseFacturasAgroInterface>(
    url,
    {
      params: filters,
    },
  );

  return response.data;
};
