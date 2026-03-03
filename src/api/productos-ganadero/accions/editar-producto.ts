import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearProductoGanaderoInterface } from "../interfaces/crear-producto-ganadero.interface";

export const EditarProductoGanadero = async (
  id: string,
  data: Partial<CrearProductoGanaderoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/productos-ganaderia/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
