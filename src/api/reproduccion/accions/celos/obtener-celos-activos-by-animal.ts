import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Celo } from "../../interfaces/response-celos-animal,interface";

export const ObtenerCelosActivosByAnimales = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/celos-animal/activos/animal/${id}`;

  const response = await veterinariaAPI.get<Celo[]>(url);

  return response.data;
};
