import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { AgregarAlimentacionAnimalInterface } from "../interface/crear-alimentacion-animal.interface";

export const CrearAlimetacionAnimal = async (
  data: AgregarAlimentacionAnimalInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/alimentacion-animal`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
