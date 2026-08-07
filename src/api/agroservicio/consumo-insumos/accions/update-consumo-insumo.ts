import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearConsumoInsumoInterface } from "../interface/crear-consumo-insumo.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const editarConsumoInsumo = async (
  id: string,
  sucursalId: string,
  insumoId: string,
  data: CrearConsumoInsumoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/consumo-agro-insumos/${sucursalId}/${insumoId}/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};

export const editarConsumoInsumoEmpleado = async (
  id: string,
  sucursalId: string,
  insumoId: string,
  data: CrearConsumoInsumoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/consumo-agro-insumos/empleado/${sucursalId}/${insumoId}/${id}`;
  const respose = await empleadosAPI.post(url, data);
  return respose;
};
