import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseTaxesInterface } from "../interfaces/response-taxes-pais.interface";

export const ObtenerTaxesByPais = async (paisId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/taxes-pais/pais/${paisId}`;

  const response = await veterinariaAPI.get<ResponseTaxesInterface[]>(url);
  return response.data;
};
