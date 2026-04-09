import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPermisoClienteInterface } from "../interface/crear-permiso-cliente.interface";

export const EditarPermisoByCliente = async (
  id: string,
  data: Partial<CrearPermisoClienteInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-permisos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
