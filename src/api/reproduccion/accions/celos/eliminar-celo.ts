import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const eliminarCelo = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/celos-animal/${id}`;

  const response = await veterinariaAPI.delete(url);

  return response.data;
};
