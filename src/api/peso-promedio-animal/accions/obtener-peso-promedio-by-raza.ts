import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponsePesoByRaza } from "../interfaces/obtener-pesos-by-raza.interface";

export const ObtenerPesoPorRaza = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/ganancia-peso-raza/ganadero`;

  const response = await veterinariaAPI.get<ResponsePesoByRaza[]>(url);
  return response.data;
};
