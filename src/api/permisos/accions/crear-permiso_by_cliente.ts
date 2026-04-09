import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPermisoClienteInterface } from "../interface/crear-permiso-cliente.interface";

export const CrearPermisoByCliente = async (
  data: CrearPermisoClienteInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-permisos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
