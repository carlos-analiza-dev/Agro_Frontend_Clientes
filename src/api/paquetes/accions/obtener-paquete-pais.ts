import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponsePaquetesInterface } from "../interface/response-paquetes.interface";

export const obtenerPaquetePais = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquetes/pais`;

  const response = await veterinariaAPI.get<ResponsePaquetesInterface[]>(url);
  return response.data;
};
