import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { IngresarUsoEquipoInterface } from "../interfaces/crear-uso-equipo.interface";

export const editarUso = async (
  id: string,
  data: Partial<IngresarUsoEquipoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/uso-equipo/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};
