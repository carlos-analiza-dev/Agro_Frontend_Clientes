import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseInfoAgro } from "../interface/response-info-agro.interface";

export const obtenerInfoAgro = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/datos-agroservicio`;
  const respose = await veterinariaAPI.get<ResponseInfoAgro>(url);
  return respose.data;
};
