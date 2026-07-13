import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const subirLogoAgro = async (id: string, formData: FormData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/datos-agroservicio/${id}/logo`;
  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
