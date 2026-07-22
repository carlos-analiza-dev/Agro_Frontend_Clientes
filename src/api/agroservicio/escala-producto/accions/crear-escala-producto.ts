import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEscalaProductoInterface } from "../interfaces/crear-escala-producto.interface";

export const CrearEscalaProducto = async (
  data: CrearEscalaProductoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-producto`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
