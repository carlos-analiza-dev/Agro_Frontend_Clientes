import axios from "axios";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Nota } from "../interface/response-nota-credito.interface";

export const descargarNotaPDF = async (
  propietarioId: string,
  id: string,
  nota: Nota,
) => {
  try {
    const url_api = `/nota-credito-pdf/agroservicio/${propietarioId}/${id}`;

    const response = await veterinariaAPI.get(url_api, {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    if (!response.data || response.data.size === 0) {
      throw new Error("El archivo PDF está vacío");
    }

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nota_${nota.id}.pdf`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);

    return { success: true, message: "Nota descargada exitosamente" };
  } catch (error) {
    let errorMessage = "Error al descargar la Nota";

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifique su internet.";
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};
