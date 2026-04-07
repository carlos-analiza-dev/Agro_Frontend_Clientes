import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseIngresosInterface } from "../interface/response-ingresos.interface";
import { FiltrosGastos } from "@/interfaces/filtros/filtros-gastos";

export const ObtenerIngresos = async (filtros?: FiltrosGastos) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/ingresos`;

  const response = await veterinariaAPI.get<ResponseIngresosInterface>(url, {
    params: filtros,
  });

  return response.data;
};
