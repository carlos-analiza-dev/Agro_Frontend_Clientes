import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateServiciosReproductivo } from "../../interfaces/crear-servicio-reproductivo.interface";

export const EditarServicioReproductivo = async (
  id: string,
  data: Partial<CreateServiciosReproductivo>,
) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/servicios-reproductivos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
