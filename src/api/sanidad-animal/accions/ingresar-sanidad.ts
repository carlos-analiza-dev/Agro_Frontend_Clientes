import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateSanidadAnimal } from "../interface/crear-sanidad.interface";

export const ingresarSanidad = async (data: CreateSanidadAnimal) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sanidad-animal`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
