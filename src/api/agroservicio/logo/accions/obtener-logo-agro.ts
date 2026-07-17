import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { LogoImage } from "../../mi-agroservicio/interface/response-info-agro.interface";

export const obtenerLogoAgro = async (propietarioId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/logos-agroservicios/${propietarioId}`;
  const respose = await veterinariaAPI.get<LogoImage>(url);
  return respose.data;
};
