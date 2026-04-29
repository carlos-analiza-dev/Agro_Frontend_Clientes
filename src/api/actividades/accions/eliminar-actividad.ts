import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const eliminarActividad = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/actividades-diarias/${id}`;
  const respose = await veterinariaAPI.delete(url);
  return respose;
};
