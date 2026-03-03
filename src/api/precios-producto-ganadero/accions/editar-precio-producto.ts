import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPrecioProductoInterface } from "../interface/crear-precio-producto.interface";

export const EditarPrecioProducto = async (
  id: string,
  data: Partial<CrearPrecioProductoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/producto-ventas/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
