import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";
import { CreateDescuentoAgro } from "../interface/crear-descuento.interface";

export const CrearDescuentoCliente = async (data: CreateDescuentoAgro) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-agro-clientes`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const CrearEmpleadoDescuentoCliente = async (
  data: CreateDescuentoAgro,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-agro-clientes/empleado`;

  const response = await empleadosAPI.post(url, data);
  return response;
};
