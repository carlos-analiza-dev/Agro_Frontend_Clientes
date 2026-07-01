import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateAnimalFromCriaData } from "../interfaces/ingresar-cria.interfaz";

export const ingresarCria = async (data: CreateAnimalFromCriaData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/crear-desde-cria`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
