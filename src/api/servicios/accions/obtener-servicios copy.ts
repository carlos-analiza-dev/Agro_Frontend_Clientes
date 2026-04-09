import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseCategoriasServicesInterface } from "../interfaces/response-categorias-services";

export const ObtenerCategoriasServices = async (
  paisId: string,
  limit: number,
  offset: number,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/servicios/pais/${paisId}?limit=${limit}&offset=${offset}`;
  const response =
    await veterinariaAPI.get<ResponseCategoriasServicesInterface>(url);
  return response.data;
};
