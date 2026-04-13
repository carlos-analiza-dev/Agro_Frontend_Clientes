import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResposeFincasAsignadasTrabajador } from "../interface/response-fincas-trabajador.interface";

export const obtenerFincasAsignadas = async (trabajadorId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-finca-trabajador/all/${trabajadorId}`;

  const response =
    await veterinariaAPI.get<ResposeFincasAsignadasTrabajador[]>(url);
  return response.data;
};
