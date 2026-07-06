import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const eliminarSanidad = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sanidad-animal/${id}`;

  const response = await veterinariaAPI.delete(url);
  return response;
};
