import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const uploadImagesChat = async (formData: FormData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/chat-marketplace/upload-images`;

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
