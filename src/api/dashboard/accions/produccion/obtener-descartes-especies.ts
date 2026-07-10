import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseDescartesEspecie } from "../../interfaces/produccion/response-descartes.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const obtenerDescartesPorEspecie = async (
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descartes-animal`;

  const response = await veterinariaAPI.get<ResponseDescartesEspecie[]>(url, {
    params: filters,
  });
  return response.data;
};
