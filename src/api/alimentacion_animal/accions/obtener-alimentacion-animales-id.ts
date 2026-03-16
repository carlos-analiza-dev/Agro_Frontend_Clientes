import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Alimento } from "../interface/response-alimentacion.interface";

export const ObtenerAlimentacionAnimalesByid = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/alimentacion-animal/${id}`;

  const response = await veterinariaAPI.get<Alimento>(url);

  return response.data;
};
