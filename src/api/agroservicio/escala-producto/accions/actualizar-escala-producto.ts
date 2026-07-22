import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEscalaProductoInterface } from "../interfaces/crear-escala-producto.interface";

export const ActualizarEscalaProducto = async (
  id: string,
  data: Partial<CrearEscalaProductoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-producto/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
