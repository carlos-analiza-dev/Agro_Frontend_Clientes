import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";
import { CreateDescuentoAgro } from "../interface/crear-descuento.interface";

export const EditarDescuentoCliente = async (
  id: string,
  data: Partial<CreateDescuentoAgro>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-agro-clientes/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const EditarEmpleadoDescuentoCliente = async (
  id: string,
  data: Partial<CreateDescuentoAgro>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-agro-clientes/empleado/${id}`;

  const response = await empleadosAPI.patch(url, data);
  return response;
};
