import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ComprarPaqueteInterface } from "../interface/comprar-paquete.interface";

export const ComprarPaquete = async (data: ComprarPaqueteInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-paquetes`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
