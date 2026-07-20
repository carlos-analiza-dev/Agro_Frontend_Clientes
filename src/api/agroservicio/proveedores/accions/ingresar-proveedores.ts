import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearProveedoresAgro } from "../interface/crear-proveedores.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const ingresarAgroProveedor = async (data: CrearProveedoresAgro) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-proveedores`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};

export const ingresarAgroProveedorEmpleados = async (
  data: CrearProveedoresAgro,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-proveedores/empleado`;
  const respose = await empleadosAPI.post(url, data);
  return respose;
};
