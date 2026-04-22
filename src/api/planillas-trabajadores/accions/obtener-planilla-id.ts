import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Planilla } from "../interfaces/response-planillas.interface";

export const obtenerPlanillasTrabajadoresById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/planilla-trabajadores/${id}`;

  const response = await veterinariaAPI.get<Planilla>(url);

  return response.data;
};
