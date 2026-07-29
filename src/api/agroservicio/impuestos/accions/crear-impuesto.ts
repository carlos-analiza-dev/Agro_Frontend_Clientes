import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { IngresarImpuestoInterface } from "../interface/crear-impuesto.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const CrearImpuestoProducto = async (
  data: IngresarImpuestoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-impuestos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const CrearEmpleadoImpuestoProducto = async (
  data: IngresarImpuestoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-impuestos/empleado`;

  const response = await empleadosAPI.post(url, data);
  return response;
};
