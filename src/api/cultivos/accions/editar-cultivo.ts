import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCultivoInterface } from "../interface/crear-cultivo.interface";

export const editarCultivo = async (
  id: string,
  data: Partial<CrearCultivoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cultivos/${id}`;
  const response = await veterinariaAPI.patch(url, data);

  return response.data;
};
