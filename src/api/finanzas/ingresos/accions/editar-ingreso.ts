import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearIngresoInterface } from "../interface/crear-ingreso.interface";

export const EditarIngreso = async (
  id: string,
  data: Partial<CrearIngresoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/ingresos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
