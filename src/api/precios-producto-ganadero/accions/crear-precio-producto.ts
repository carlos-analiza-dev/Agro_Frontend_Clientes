import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPrecioProductoInterface } from "../interface/crear-precio-producto.interface";

export const CrearPrecioProducto = async (
  data: CrearPrecioProductoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/producto-ventas`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
