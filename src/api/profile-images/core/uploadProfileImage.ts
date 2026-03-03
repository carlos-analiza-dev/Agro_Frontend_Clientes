import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const uploadProfileImage = async (uri: string) => {
  const fetchResponse = await fetch(uri);
  const blob = await fetchResponse.blob();

  const timestamp = Date.now();
  const extension = blob.type.split("/")[1] || "jpg";
  const filename = `profile_${timestamp}.${extension}`;

  const file = new File([blob], filename, { type: blob.type });

  const formData = new FormData();
  formData.append("file", file);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/images-client/upload`;

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
