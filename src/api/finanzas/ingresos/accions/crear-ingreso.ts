import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearIngresoInterface } from "../interface/crear-ingreso.interface";

export const AgregarNuevoIngreso = async (data: CrearIngresoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/ingresos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
