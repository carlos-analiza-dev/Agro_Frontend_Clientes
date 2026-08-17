import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearNotaCreditoInterface } from "../interface/crear-nota-credito.interface";

export const ingresarNotaCredito = async (data: CrearNotaCreditoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/nota-credito-agro`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
