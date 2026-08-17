import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearNotaCreditoInterface } from "../interface/crear-nota-credito.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const CrearNotaCredito = async (data: CrearNotaCreditoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/nota-credito-agro`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const CrearNotaCreditoEmpleado = async (
  data: CrearNotaCreditoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/nota-credito-agro/empleado`;

  const response = await empleadosAPI.post(url, data);
  return response;
};
