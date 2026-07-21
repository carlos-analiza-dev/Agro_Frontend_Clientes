import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const uploadImagesProducto = async (
  productoId: string,
  imagenes: string[],
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-productos/upload/${productoId}`;

  try {
    const formData = new FormData();

    for (const image of imagenes) {
      const base64Response = await fetch(image);
      const blob = await base64Response.blob();

      formData.append(
        "imagenes",
        blob,
        `producto-${productoId}-${Date.now()}.jpg`,
      );
    }

    const response = await veterinariaAPI.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("No se pudieron subir las imágenes del producto");
  }
};
