import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearJornadaInterface } from "../interface/crear-jornada.interface";

export const CreateJornadaTrabajador = async (data: CrearJornadaInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/jornada-trabajadores`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
