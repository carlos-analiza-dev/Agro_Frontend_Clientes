import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearConsumoInsumoInterface } from "../interface/crear-consumo-insumo.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const ingresarConsumoInsumo = async (
  sucursalId: string,
  insumoId: string,
  data: CrearConsumoInsumoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/consumo-agro-insumos/${sucursalId}/${insumoId}`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};

export const ingresarConsumoInsumoEmpleado = async (
  sucursalId: string,
  insumoId: string,
  data: CrearConsumoInsumoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/consumo-agro-insumos/empleado/${sucursalId}/${insumoId}`;
  const respose = await empleadosAPI.post(url, data);
  return respose;
};
