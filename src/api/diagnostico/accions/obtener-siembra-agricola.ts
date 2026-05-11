import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseConsulaAgricola } from "../interface/response-consulta-agricola.interface";
import { SiembraInteligenteInterface } from "../interface/consulta-siembra.interface";

export const ObtenerConsultaSiembra = async (
  data: SiembraInteligenteInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/diagnostico/densidad-siembra`;
  const respose = await veterinariaAPI.post<ResponseConsulaAgricola>(url, data);
  return respose.data;
};
