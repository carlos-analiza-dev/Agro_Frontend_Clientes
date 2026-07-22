import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearDescuentoInterface } from "../interface/crear-descuento-producto.interface";

export const CrearDescuentoProducto = async (data: CrearDescuentoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-agro-producto`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
