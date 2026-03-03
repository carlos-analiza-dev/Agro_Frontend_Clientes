import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearProductoGanaderoInterface } from "../interfaces/crear-producto-ganadero.interface";

export const CrearProductoGanadero = async (
  data: CrearProductoGanaderoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/productos-ganaderia`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
