import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Trabajador } from "../interface/response-trabajadores.interface";

export const obtenerAllTrabajadores = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/all-trabajadores`;

  const response = await veterinariaAPI.get<Trabajador[]>(url);

  return response.data;
};
