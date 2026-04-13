import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCliente } from "../interfaces/crear-cliente.interface";

export const ActualizarVerificacion = async (id: string, verified: boolean) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/${id}`;
  const respose = await veterinariaAPI.patch(url, { verified });
  return respose;
};
