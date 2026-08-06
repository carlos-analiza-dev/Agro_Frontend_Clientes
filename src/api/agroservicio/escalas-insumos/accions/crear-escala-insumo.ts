import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEscalaAgroInsumoInterface } from "../interfaces/crear-escala-insumo.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const CrearEscalaAgroInsumo = async (
  data: CrearEscalaAgroInsumoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-insumos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const CrearEscalaAgroInsumoEmpleado = async (
  data: CrearEscalaAgroInsumoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-insumos/empleado`;

  const response = await empleadosAPI.post(url, data);
  return response;
};
