import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearSubCatInterface } from "../interface/crear-subcategoria.interface";

export const CrearSubCategoria = async (data: CrearSubCatInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/subcategorias`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
