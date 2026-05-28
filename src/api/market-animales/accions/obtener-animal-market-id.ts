import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ProductoAnimal } from "../interfaces/response-market-animales.interface";

export const obtenerAnimalMarketById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marketplace-animales/${id}`;

  const response = await veterinariaAPI.get<ProductoAnimal>(url);

  return response.data;
};
