import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPesoAnimalInterface } from "../interfaces/crear-peso-animal.interface";

export const EditarPesoAnimal = async (
  id: string,
  data: CrearPesoAnimalInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/peso-historial/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
