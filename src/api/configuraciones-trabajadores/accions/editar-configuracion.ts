import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearConfigTrabajadorInterface } from "../interface/crear-config.interface";

export const EditarConfigTrabajador = async (
  id: string,
  data: CrearConfigTrabajadorInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/configuracion-trabajadores/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};
