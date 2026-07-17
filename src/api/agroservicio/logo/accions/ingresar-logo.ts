import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const ingresarLogoAgro = async (agroId: string, data: FormData) => {
  const url = `/logos-agroservicios/upload/${agroId}`;
  const response = await veterinariaAPI.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
