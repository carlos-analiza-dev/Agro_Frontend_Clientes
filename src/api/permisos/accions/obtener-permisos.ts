import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Permiso } from "../interface/response-permisos.interface";

export const obtenerPermisoByPropietario = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-permisos/propietario`;

  const response = await veterinariaAPI.get<Permiso[]>(url);
  return response.data;
};
