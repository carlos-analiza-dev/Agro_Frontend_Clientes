import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Configuraciones } from "../interface/response-config-trabajadores.interface";

export const ObtenerConfiguracionesTrabajadoresById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/configuracion-trabajadores/${id}`;

  const response = await veterinariaAPI.get<Configuraciones>(url);
  return response.data;
};
