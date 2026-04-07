import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import {
  FiltrosRentabilidad,
  RentabilidadPorFinca,
} from "../interface/rentabilidad.interface";

export const ObtenerRentabilidadPorFinca = async (
  filtros?: FiltrosRentabilidad,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/rentabilidad/por-finca`;
  const response = await veterinariaAPI.get<RentabilidadPorFinca[]>(url, {
    params: filtros,
  });
  return response.data;
};
