import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const newViewPublicacion = async (publicacionId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marketplace-visualizaciones`;
  const respose = await veterinariaAPI.post(url, { publicacionId });
  return respose;
};
