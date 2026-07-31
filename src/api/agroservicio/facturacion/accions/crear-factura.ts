import { CrearFacturaAgroInterface } from "../interface/crear-factura-agro.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const CrearFacturaAgro = async (data: CrearFacturaAgroInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-facturacion`;

  const response = await empleadosAPI.post(url, data);
  return response;
};
