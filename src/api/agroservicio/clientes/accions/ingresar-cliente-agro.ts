import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearClienteAgroInterface } from "../interfaces/crear-cliente-agro.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const ingresarAgroCliente = async (data: CrearClienteAgroInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-clientes`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};

export const ingresarAgroClienteEmpleado = async (
  data: CrearClienteAgroInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-clientes/empleado`;
  const respose = await empleadosAPI.post(url, data);
  return respose;
};
