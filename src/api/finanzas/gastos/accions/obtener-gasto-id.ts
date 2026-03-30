import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Gastos } from "../interface/gastos-response.interface";

export const ObtenerGastoById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/gastos/${id}`;

  const response = await veterinariaAPI.get<Gastos>(url);

  return response.data;
};
