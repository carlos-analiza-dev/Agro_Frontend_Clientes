import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { AgregarInventarioInterface } from "../interfaces/agregar-inventario.interface";

export const AgregarInventarioProducto = async (
  data: AgregarInventarioInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/inventario-productos-ganaderia`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
