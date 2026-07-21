import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const eliminarImagen = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-productos/upload/${id}`;
  const respose = await veterinariaAPI.delete(url);
  return respose;
};
