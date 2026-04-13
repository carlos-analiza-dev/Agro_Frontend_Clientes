import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCliente } from "@/api/cliente/interfaces/crear-cliente.interface";

export const actualizarTrabajador = async (
  id: string,
  data: Partial<CrearCliente>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/trabajador/${id}`;
  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
