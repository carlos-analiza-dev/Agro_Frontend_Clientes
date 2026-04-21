import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearJornadaInterface } from "../interface/crear-jornada.interface";

export const EditarJornadaTrabajador = async (
  id: string,
  data: Partial<CrearJornadaInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/jornada-trabajadores/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};
