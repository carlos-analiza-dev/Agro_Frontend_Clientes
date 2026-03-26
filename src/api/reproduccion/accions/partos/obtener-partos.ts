import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResposnePartosInterface } from "../../interfaces/response-partos.interface";
import { FiltrosPartos } from "@/interfaces/filtros/filtros-partos";

export const ObtenerPartosAnimales = async (filtros?: FiltrosPartos) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/parto-animal`;

  const response = await veterinariaAPI.get<ResposnePartosInterface>(url, {
    params: filtros,
  });

  return response.data;
};
