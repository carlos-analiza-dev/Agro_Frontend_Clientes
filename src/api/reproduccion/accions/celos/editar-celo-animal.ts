import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCeloInterface } from "../../interfaces/crear-celo.response.interface";

export const EditarCeloAnimal = async (
  id: string,
  data: Partial<CrearCeloInterface>,
) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/celos-animal/${id}/finalizar`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
