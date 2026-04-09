import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { FiltrosTrabajadores } from "@/interfaces/filtros/filtros-trabajadores";
import { ResponseTrabajadoresInterface } from "../interface/response-trabajadores.interface";

export const obtenerTrabajadores = async (filtros?: FiltrosTrabajadores) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/trabajadores`;

  const response = await veterinariaAPI.get<ResponseTrabajadoresInterface>(
    url,
    {
      params: filtros,
    },
  );

  return response.data;
};
