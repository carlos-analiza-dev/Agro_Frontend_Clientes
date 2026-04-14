import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseCitasInterface } from "../interfaces/response-citas-user.interface";

export const ObtenerCitasByUser = async (
  limit: number = 10,
  offset: number = 0,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/citas/usuario?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseCitasInterface>(url);
  return response.data;
};
