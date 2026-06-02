import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const marcarPublicacionVendida = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marketplace-animales/${id}/vendido`;
  const respose = await veterinariaAPI.patch(url, {});
  return respose;
};
