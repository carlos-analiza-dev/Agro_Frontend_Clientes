import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCompraAgroInsumoInterface } from "../interfaces/crear-compra-insumos.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const CrearCompraAgroInsumo = async (
  data: CrearCompraAgroInsumoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/compra-agro-insumos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const CrearCompraAgroInsumoEmpleado = async (
  data: CrearCompraAgroInsumoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/compra-agro-insumos/empleado`;

  const response = await empleadosAPI.post(url, data);
  return response;
};
