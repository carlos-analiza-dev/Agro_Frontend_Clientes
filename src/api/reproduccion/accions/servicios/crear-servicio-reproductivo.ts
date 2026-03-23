import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateServiciosReproductivo } from "../../interfaces/crear-servicio-reproductivo.interface";

export const CrearServicioReproductivo = async (
  data: CreateServiciosReproductivo,
) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/servicios-reproductivos`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
