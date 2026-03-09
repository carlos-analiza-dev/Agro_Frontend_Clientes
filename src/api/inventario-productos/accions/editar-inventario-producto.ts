import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { AgregarInventarioInterface } from "../interfaces/agregar-inventario.interface";

export const EditarInventarioProducto = async (
  id: string,
  data: Partial<AgregarInventarioInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/inventario-productos-ganaderia/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
