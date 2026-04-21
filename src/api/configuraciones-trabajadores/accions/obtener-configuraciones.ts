import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseConfigTrabajadoresInterface } from "../interface/response-config-trabajadores.interface";

export const ObtenerConfiguracionesTrabajadores = async (
  limit: number = 10,
  offset: number = 0,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/configuracion-trabajadores?limit=${limit}&offset=${offset}`;

  const response =
    await veterinariaAPI.get<ResponseConfigTrabajadoresInterface>(url);
  return response.data;
};
