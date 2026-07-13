import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { IngresarInfoAgro } from "../interface/ingresar-info-agro.interface";

export const editarInfoAgro = async (
  id: string,
  data: Partial<IngresarInfoAgro>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/datos-agroservicio/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};
