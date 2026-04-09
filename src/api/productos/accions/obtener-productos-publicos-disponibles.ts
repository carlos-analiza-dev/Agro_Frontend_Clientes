import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProductosDisponibles } from "../interfaces/response-productos-disponibles.interface";

export const ObtenerProductosPublicos = async ({
  pageParam = 0,
  limit = 10,
  categoria = "",
  pais = "",
}: {
  pageParam?: number;
  limit?: number;
  categoria?: string;
  pais?: string;
}) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/productos-publics-disponibles?limit=${limit}&offset=${pageParam}&categoria=${categoria}&pais=${pais}`;

  const response = await veterinariaAPI.get<ResponseProductosDisponibles>(url);
  return response.data;
};
