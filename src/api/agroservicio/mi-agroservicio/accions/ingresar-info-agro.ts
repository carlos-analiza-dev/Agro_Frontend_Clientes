import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { IngresarInfoAgro } from "../interface/ingresar-info-agro.interface";

export const ingresarInfoAgro = async (data: IngresarInfoAgro) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/datos-agroservicio`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
