import { CrearOpinionInterface } from "@/api/paises/interfaces/crear-opinion.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const CrearOpinion = async (data: CrearOpinionInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/producto-opiniones`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
