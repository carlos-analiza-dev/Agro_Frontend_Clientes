import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEmpleadoAgroInterface } from "../interface/crear-empleado-agro.interface";

export const ingresarAgroEmpleado = async (
  data: CrearEmpleadoAgroInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/empleados-agro`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
