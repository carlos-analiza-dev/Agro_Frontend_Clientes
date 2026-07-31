import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearFacturaAgroInterface } from "../interface/crear-factura-agro.interface";

export type EditarFacturaInterface = Partial<CrearFacturaAgroInterface>;

export const ProcesarFactura = async (
  id: string,
  data: EditarFacturaInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-facturacion/${id}/procesar`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
