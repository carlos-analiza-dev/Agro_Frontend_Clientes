import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const uploadImagesActividad = async (
  images: string[],
  actividadId: string,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/actividad-fotos/upload`;

  try {
    const formData = new FormData();

    for (const image of images) {
      const base64Response = await fetch(image);
      const blob = await base64Response.blob();

      formData.append(
        "files",
        blob,
        `actividad-${actividadId}-${Date.now()}.jpg`,
      );
    }

    formData.append("actividadId", actividadId);

    const response = await veterinariaAPI.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("No se pudieron subir las imágenes de la actividad");
  }
};
