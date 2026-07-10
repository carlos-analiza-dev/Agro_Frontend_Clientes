import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseDescartesEspecie } from "../../interfaces/produccion/response-descartes.interface";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";

export const obtenerMortalidadPorEspecie = async (
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/mortalidad-animal`;

  const response = await veterinariaAPI.get<ResponseDescartesEspecie[]>(url, {
    params: filters,
  });
  return response.data;
};
