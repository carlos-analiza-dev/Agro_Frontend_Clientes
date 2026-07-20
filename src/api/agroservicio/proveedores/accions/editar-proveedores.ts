import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearProveedoresAgro } from "../interface/crear-proveedores.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const editarAgroProveedor = async (
  id: string,
  data: Partial<CrearProveedoresAgro>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-proveedores/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};

export const editarAgroProveedorEmpleados = async (
  id: string,
  data: Partial<CrearProveedoresAgro>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-proveedores/empleado/${id}`;
  const respose = await empleadosAPI.patch(url, data);
  return respose;
};
