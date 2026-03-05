import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPesoRazaInterface } from "../interfaces/crear-peso-raza.interface";

export const EditarPesoByRaza = async (
  id: string,
  data: Partial<CrearPesoRazaInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/ganancia-peso-raza/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
