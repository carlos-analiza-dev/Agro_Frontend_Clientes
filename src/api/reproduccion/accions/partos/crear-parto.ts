import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPartoInterface } from "../../interfaces/crear-parto.interface";

export const CrearPartoAnimal = async (data: CrearPartoInterface) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/parto-animal`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
