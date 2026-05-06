import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearMantenimientoInterface } from "../interface/ingresar-mantenimiento.interface";

export const ingresarMantenimiento = async (
  data: CrearMantenimientoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/mantenimiento-equipo`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
