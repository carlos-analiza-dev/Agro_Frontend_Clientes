import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const EliminarPermisoByCliente = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-permisos/${id}`;
  const response = await veterinariaAPI.delete(url);
  return response;
};
