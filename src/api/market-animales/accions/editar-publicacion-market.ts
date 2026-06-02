import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const editarPublicacionesMarket = async (
  id: string,
  formData: FormData,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marketplace-animales/${id}`;

  const response = await veterinariaAPI.patch(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};
