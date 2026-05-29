import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateMarketplaceAnimale } from "../interfaces/crear-publicacion.interface";

export const editarPublicacionesMarket = async (
  id: string,
  data: Partial<CreateMarketplaceAnimale>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marketplace-animales/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};
