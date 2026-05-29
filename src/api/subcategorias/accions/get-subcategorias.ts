import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { SubCategoria } from "../interface/get-subcategorias.interface";

export const ObtenerSubCategoriasByCategoria = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/subcategorias/categoria/${id}`;

  const response = await veterinariaAPI.get<SubCategoria[]>(url);
  return response.data;
};
