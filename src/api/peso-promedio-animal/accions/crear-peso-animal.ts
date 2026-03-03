import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPesoAnimalInterface } from "../interfaces/crear-peso-animal.interface";

export const CrearPesoAnimal = async (data: CrearPesoAnimalInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/peso-historial`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
