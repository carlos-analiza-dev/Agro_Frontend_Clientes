import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { RentabilidadPorPeriodo } from "../interface/rentabilidad.interface";

export const ObtenerRentabilidadPorPeriodo = async (
  periodo: "day" | "week" | "month" | "year",
  filtros?: any,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/rentabilidad/por-periodo`;
  const response = await veterinariaAPI.get<RentabilidadPorPeriodo[]>(url, {
    params: { ...filtros, periodo },
  });
  return response.data;
};
