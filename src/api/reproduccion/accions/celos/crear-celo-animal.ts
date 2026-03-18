import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCeloInterface } from "../../interfaces/crear-celo.response.interface";

export const CrearCeloAnimal = async (data: CrearCeloInterface) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/celos-animal`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
