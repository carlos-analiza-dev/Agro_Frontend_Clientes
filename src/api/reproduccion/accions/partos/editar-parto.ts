import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPartoInterface } from "../../interfaces/crear-parto.interface";

export const EditarPartoAnimal = async (
  id: string,
  data: Partial<CrearPartoInterface>,
) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/parto-animal/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
