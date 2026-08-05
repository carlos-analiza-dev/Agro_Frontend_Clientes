import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";
import { CrearAgroInsumoInterface } from "../interfaces/crear-agro-insumo.interface";

export const ingresarAgroInsumo = async (data: CrearAgroInsumoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro_insumos`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};

export const ingresarAgroInsumoEmpleados = async (
  data: CrearAgroInsumoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro_insumos/empleado`;
  const respose = await empleadosAPI.post(url, data);
  return respose;
};
