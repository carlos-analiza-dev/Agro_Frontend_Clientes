import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { AgroProducto } from "../interface/response-productos-agro.interface";

export const ObtenerProductosDisponibles = async (
  propietarioId: string,
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-productos/productos-disponibles/${propietarioId}`;

  const response = await veterinariaAPI.get<AgroProducto[]>(url, {
    params: filters,
  });
  return response.data;
};

export default ObtenerProductosDisponibles;
