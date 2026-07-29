import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { IngresarImpuestoInterface } from "../interface/crear-impuesto.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const EditarImpuestoProducto = async (
  id: string,
  data: Partial<IngresarImpuestoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-impuestos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const EditarEmpleadoImpuestoProducto = async (
  id: string,
  data: Partial<IngresarImpuestoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-impuestos/empleado/${id}`;

  const response = await empleadosAPI.patch(url, data);
  return response;
};
