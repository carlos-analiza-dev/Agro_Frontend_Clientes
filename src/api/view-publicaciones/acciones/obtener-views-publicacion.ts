import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseViewsPublicacionInterface } from "../interface/response-views-publicacion";

export const obtenerViesPublicacion = async (publicacionId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marketplace-visualizaciones/${publicacionId}`;
  const respose =
    await veterinariaAPI.get<ResponseViewsPublicacionInterface>(url);
  return respose.data;
};
