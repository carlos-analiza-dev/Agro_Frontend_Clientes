import { CrearFacturaAgroInterface } from "../interface/crear-factura-agro.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export type EditarFacturaInterface = Partial<CrearFacturaAgroInterface>;

export const EditarFacturaAgro = async (
  id: string,
  data: EditarFacturaInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-facturacion/${id}`;

  const response = await empleadosAPI.patch(url, data);
  return response;
};
