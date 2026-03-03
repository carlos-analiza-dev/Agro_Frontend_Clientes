import { CrearOpinionInterface } from "@/api/paises/interfaces/crear-opinion.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const EditarOpinion = async (
  id: string,
  data: Partial<CrearOpinionInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/producto-opiniones/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
