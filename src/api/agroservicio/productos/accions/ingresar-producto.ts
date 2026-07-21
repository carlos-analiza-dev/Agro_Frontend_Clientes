import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearAgroProducto } from "../interface/crear-agroproducto.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const ingresarAgroProducto = async (data: CrearAgroProducto) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-productos`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};

export const ingresarAgroProductoEmpleados = async (
  data: CrearAgroProducto,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-productos/empleado`;
  const respose = await empleadosAPI.post(url, data);
  return respose;
};
