import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Ingreso } from "../interface/response-ingresos.interface";

export const ObtenerIngresosById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/ingresos/${id}`;

  const response = await veterinariaAPI.get<Ingreso>(url);

  return response.data;
};
