import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaqueteInterface } from "../interface/paquete.interface";

export const obtenerPaqueteCliente = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-paquetes/cliente`;

  const response = await veterinariaAPI.get<PaqueteInterface>(url);
  return response.data;
};
