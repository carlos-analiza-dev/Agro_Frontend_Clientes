import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ConsultaAgricolaInterface } from "../interface/consulta-agricola.interface";
import { ResponseConsulaAgricola } from "../interface/response-consulta-agricola.interface";

export const ObtenerConsultaAgricola = async (
  data: ConsultaAgricolaInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/diagnostico/consulta`;
  const respose = await veterinariaAPI.post<ResponseConsulaAgricola>(url, data);
  return respose.data;
};
