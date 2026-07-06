import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateSanidadAnimal } from "../interface/crear-sanidad.interface";

export const editarSanidad = async (
  id: string,
  data: Partial<CreateSanidadAnimal>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sanidad-animal/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
