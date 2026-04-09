import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Categoria } from "../interfaces/response-categorias";

export const ObtenerCategorias = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/categorias/all`;
  const response = await veterinariaAPI.get<Categoria[]>(url);
  return response.data;
};
