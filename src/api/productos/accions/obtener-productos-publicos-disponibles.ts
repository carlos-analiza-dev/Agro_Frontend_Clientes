import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProductosDisponibles } from "../interfaces/response-productos-disponibles.interface";

export const ObtenerProductosPublicos = async ({
  pageParam = 0,
  limit = 10,
  tipo_categoria = "",
  pais = "",
}: {
  pageParam?: number;
  limit?: number;
  tipo_categoria?: string;
  pais?: string;
}) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/productos-publics-disponibles?limit=${limit}&offset=${pageParam}&tipo_categoria=${tipo_categoria}&pais=${pais}`;

  const response = await veterinariaAPI.get<ResponseProductosDisponibles>(url);
  return response.data;
};
