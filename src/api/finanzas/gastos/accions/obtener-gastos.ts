import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { GastosResponse } from "../interface/gastos-response.interface";
import { FiltrosGastos } from "@/interfaces/filtros/filtros-gastos";

export const ObtenerGastos = async (filtros?: FiltrosGastos) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/gastos`;

  const response = await veterinariaAPI.get<GastosResponse>(url, {
    params: filtros,
  });

  return response.data;
};
