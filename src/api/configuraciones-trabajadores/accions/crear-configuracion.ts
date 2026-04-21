import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearConfigTrabajadorInterface } from "../interface/crear-config.interface";

export const CreateConfigTrabajador = async (
  data: CrearConfigTrabajadorInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/configuracion-trabajadores`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
