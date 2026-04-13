import { CrearCliente } from "@/api/cliente/interfaces/crear-cliente.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const crearTrabajador = async (data: CrearCliente) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/register-trabajador`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
