import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseRolesAgroInterface } from "../interface/obtener-roles-agro.interface";

export const obtenerRoleslesAgro = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-agro`;

  const response = await veterinariaAPI.get<ResponseRolesAgroInterface[]>(url);

  return response.data;
};
