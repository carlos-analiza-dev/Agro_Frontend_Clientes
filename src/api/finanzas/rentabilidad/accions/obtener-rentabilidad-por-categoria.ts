import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { RentabilidadPorCategoria } from "../interface/rentabilidad.interface";

export const ObtenerRentabilidadPorCategoria = async (filtros?: any) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/rentabilidad/por-categoria`;
  const response = await veterinariaAPI.get<RentabilidadPorCategoria[]>(url, {
    params: filtros,
  });
  return response.data;
};
