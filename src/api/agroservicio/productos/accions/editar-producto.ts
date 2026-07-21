import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearAgroProducto } from "../interface/crear-agroproducto.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const editarAgroProducto = async (
  id: string,
  data: Partial<CrearAgroProducto>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-productos/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};

export const editarAgroProductoEmpleados = async (
  id: string,
  data: Partial<CrearAgroProducto>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-productos/empleado/${id}`;
  const respose = await empleadosAPI.patch(url, data);
  return respose;
};
