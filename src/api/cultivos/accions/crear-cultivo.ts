import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCultivoInterface } from "../interface/crear-cultivo.interface";

export const ingresarCultivo = async (data: CrearCultivoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cultivos`;
  const response = await veterinariaAPI.post(url, data);

  return response.data;
};
