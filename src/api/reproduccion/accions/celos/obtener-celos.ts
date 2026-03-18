import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseCelosAnimalInterface } from "../../interfaces/response-celos-animal,interface";
import { FiltrosCelos } from "@/interfaces/filtros/celos.filtros.interface";

export const ObtenerCelosAnimales = async (filtros?: FiltrosCelos) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/celos-animal`;

  const response = await veterinariaAPI.get<ResponseCelosAnimalInterface>(url, {
    params: filtros,
  });

  return response.data;
};
