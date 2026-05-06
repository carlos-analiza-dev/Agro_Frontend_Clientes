import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearMantenimientoInterface } from "../interface/ingresar-mantenimiento.interface";

export const editarMantenimiento = async (
  id: string,
  data: Partial<CrearMantenimientoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/mantenimiento-equipo/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};
