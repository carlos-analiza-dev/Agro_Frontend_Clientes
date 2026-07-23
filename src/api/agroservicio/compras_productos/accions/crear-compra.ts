import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCompraInterface } from "../interface/crear-compra.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const CrearCompraAgroProducto = async (data: CrearCompraInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-compras-productos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const CrearCompraAgroProductoByEmpleado = async (
  data: CrearCompraInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-compras-productos/empleado`;

  const response = await empleadosAPI.post(url, data);
  return response;
};
