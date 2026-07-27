import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseLotesBySucursal } from "../interfaces/response-lotes-sucursal.interface";

export interface LotesFiltersInterafce {
  limit?: number;
  offset?: number;
}

export interface MovimientosInvFilters {
  limit?: number;
  offset?: number;
  fechaInicio?: string;
  fechaFin?: string;
  sucursal?: string;
}

export const obtenerLotesSucursal = async (
  sucursalId: string,
  propietariId: string,
  filters?: LotesFiltersInterafce,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-lotes-productos/sucursal/${sucursalId}/${propietariId}`;
  const response = await veterinariaAPI.get<ResponseLotesBySucursal>(url, {
    params: filters,
  });
  return response.data;
};
