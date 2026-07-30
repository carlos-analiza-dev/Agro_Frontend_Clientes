import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearClienteAgroInterface } from "../interfaces/crear-cliente-agro.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const editarAgroCliente = async (
  id: string,
  data: Partial<CrearClienteAgroInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-clientes/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};

export const editarAgroClienteEmpleado = async (
  id: string,
  data: Partial<CrearClienteAgroInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-clientes/empleado/${id}`;
  const respose = await empleadosAPI.patch(url, data);
  return respose;
};
