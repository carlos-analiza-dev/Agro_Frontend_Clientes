import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponsePermisosInterface } from "../interface/response-permisos.interface";

export const ObtenerPermisosClienteId = async (clienteId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-permisos/${clienteId}`;

  const response = await veterinariaAPI.get<ResponsePermisosInterface[]>(url);
  return response.data;
};
