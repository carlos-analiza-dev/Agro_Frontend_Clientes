import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateMortalidadAnimal } from "../interfaces/ingresar-mortalidad.interface";

export const ActualizarAnimalMuerte = async (
  id: string,
  data: CreateMortalidadAnimal,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/${id}/death-status`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const ActualizarAnimalMuerteAve = async (
  id: string,
  data: CreateMortalidadAnimal,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/${id}/death-status-aves`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const ActualizarAnimalMuertePez = async (
  id: string,
  data: CreateMortalidadAnimal,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/${id}/death-status-peces`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
