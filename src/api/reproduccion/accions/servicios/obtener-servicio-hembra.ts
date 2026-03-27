import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Servicio } from "../../interfaces/response-servicio-repoductivo.interface";

export const ObtenerServiciosReproductivoByHembraId = async (
  id: string,
): Promise<Servicio[]> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/servicios-reproductivos/hembra/${id}`;

  const response = await veterinariaAPI.get<Servicio[]>(url);

  return response.data;
};
