import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEscalaAgroInsumoInterface } from "../interfaces/crear-escala-insumo.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const ActualizarEscalaAgroInsumo = async (
  id: string,
  data: Partial<CrearEscalaAgroInsumoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-insumos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const ActualizarEscalaAgroInsumoEmpleado = async (
  id: string,
  data: Partial<CrearEscalaAgroInsumoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-insumos/empleado/${id}`;

  const response = await empleadosAPI.patch(url, data);
  return response;
};
