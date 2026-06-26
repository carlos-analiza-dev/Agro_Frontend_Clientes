import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearAnimalByFinca } from "../interfaces/crear-animal.interface";
import { AvicolaData } from "../interfaces/crear-avicola.interface";
import { PecesData } from "../interfaces/crear-peces.interface";

export const ActualizarAnimal = async (
  id: string,
  data: Partial<CrearAnimalByFinca>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const ActualizarAvicola = async (
  id: string,
  data: Partial<AvicolaData>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/avicola/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const ActualizarPeces = async (id: string, data: Partial<PecesData>) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/peces/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

/* export const ActualizarAnimal = async (
  id: string,
  data: Partial<CrearAnimalByFinca>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
 */
