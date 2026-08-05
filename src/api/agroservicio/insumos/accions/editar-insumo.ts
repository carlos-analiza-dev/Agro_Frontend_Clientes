import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";
import { CrearAgroInsumoInterface } from "../interfaces/crear-agro-insumo.interface";

export const editarAgroInsumo = async (
  id: string,
  data: Partial<CrearAgroInsumoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro_insumos/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};

export const editarAgroInsumoEmpleados = async (
  id: string,
  data: Partial<CrearAgroInsumoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro_insumos/empleado/${id}`;
  const respose = await empleadosAPI.patch(url, data);
  return respose;
};
