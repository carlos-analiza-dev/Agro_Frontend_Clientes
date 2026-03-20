import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateServicioReproductivoInterface } from "../../interfaces/crear-servicio-reproductivo.interface";

export const EditarServicioReproductivo = async (
  id: string,
  data: Partial<CreateServicioReproductivoInterface>,
) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/servicios-reproductivos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
