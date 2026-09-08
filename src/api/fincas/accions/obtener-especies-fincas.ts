import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseEspeciesFincas } from "../interfaces/response-especies-fincas.interface";

export const ObtenerEspeciesFincas = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/fincas-ganadero/especies-maneja`;

  const response = await veterinariaAPI.get<ResponseEspeciesFincas[]>(url);
  return response.data;
};
