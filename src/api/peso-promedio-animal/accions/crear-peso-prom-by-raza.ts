import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPesoRazaInterface } from "../interfaces/crear-peso-raza.interface";

export const CrearPesoByRaza = async (data: CrearPesoRazaInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/ganancia-peso-raza`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
