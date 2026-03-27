import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Parto } from "../../interfaces/response-partos.interface";

export const ObtenerPartoById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/parto-animal/${id}`;

  const response = await veterinariaAPI.get<Parto>(url);

  return response.data;
};
