import { Trabajador } from "@/api/trabajadores/interface/response-trabajadores.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const clienetById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/${id}`;

  const response = await veterinariaAPI.get<Trabajador>(url);
  return response.data;
};
