import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearSubCatInterface } from "../interface/crear-subcategoria.interface";

export const ActualizarSubCategoria = async (
  id: string,
  data: Partial<CrearSubCatInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/subcategorias/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
