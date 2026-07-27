import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { TransferirProductoInterface } from "../interfaces/tranfsferir-producto.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const transferirProducto = async (data: TransferirProductoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-lotes-productos/transferir`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const transferirProductoEmpleado = async (
  data: TransferirProductoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-lotes-productos/transferir/empleado`;

  const response = await empleadosAPI.post(url, data);
  return response;
};
