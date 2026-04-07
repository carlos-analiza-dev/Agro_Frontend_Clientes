import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosRentabilidad } from "../interface/rentabilidad.interface";
import { RentabilidadGeneralInterface } from "../interface/response-rentabilidad-general.interface";

export const ObtenerRentabilidadGeneral = async (
  filtros?: FiltrosRentabilidad,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/rentabilidad/general`;

  const response = await veterinariaAPI.get<RentabilidadGeneralInterface>(url, {
    params: filtros,
  });

  return response.data;
};
