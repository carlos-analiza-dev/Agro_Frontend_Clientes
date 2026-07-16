import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEmpleadoAgroInterface } from "../interface/crear-empleado-agro.interface";

export const editarAgroEmpleado = async (
  id: string,
  data: Partial<CrearEmpleadoAgroInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/empleados-agro/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};

export const editarStatusAgroEmpleado = async (
  id: string,
  isActive: boolean,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/empleados-agro/${id}`;
  const respose = await veterinariaAPI.patch(url, { isActive });
  return respose;
};
