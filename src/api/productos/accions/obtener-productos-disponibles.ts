import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProductosDisponibles } from "../interfaces/response-productos-disponibles.interface";

export const ObtenerProductos = async ({
  pageParam = 0,
  limit = 10,
  categoria = "",
}: {
  pageParam?: number;
  limit?: number;
  categoria?: string;
}) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/productos-disponibles-clientes?limit=${limit}&offset=${pageParam}&categoria=${categoria}`;

  const response = await veterinariaAPI.get<ResponseProductosDisponibles>(url);
  return response.data;
};
