import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearFacturaAgroInterface } from "../interface/crear-factura-agro.interface";

export type EditarFacturaInterface = Partial<CrearFacturaAgroInterface>;

export const AutorizarCancelacionFactura = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-facturacion/${id}/autorizar-cancelacion`;

  const response = await veterinariaAPI.patch(url, {});
  return response;
};
