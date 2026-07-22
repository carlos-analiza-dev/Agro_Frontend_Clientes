import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearDescuentoInterface } from "../interface/crear-descuento-producto.interface";

export const ActualizarDescuentoProducto = async (
  id: string,
  data: Partial<CrearDescuentoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-agro-producto/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
