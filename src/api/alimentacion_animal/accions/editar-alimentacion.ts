import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { AgregarAlimentacionAnimalInterface } from "../interface/crear-alimentacion-animal.interface";

export const EditarAlimetacionAnimal = async (
  id: string,
  data: Partial<AgregarAlimentacionAnimalInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/alimentacion-animal/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
