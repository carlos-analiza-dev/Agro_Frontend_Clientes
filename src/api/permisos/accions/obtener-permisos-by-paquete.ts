import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import {
  Permiso,
  ResponsePermisosInterface,
} from "../interface/response-permisos.interface";

export const ObtenerPermisosPaqueteId = async (paqueteId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquete-permisos/paquete-clientes/${paqueteId}`;
  const response = await veterinariaAPI.get<Permiso[]>(url);
  return response.data;
};

export const ObtenerPermisosPaquete = async (paqueteId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquete-permisos/cliente-paquete/${paqueteId}`;

  const response = await veterinariaAPI.get<ResponsePermisosInterface[]>(url);
  return response.data;
};
