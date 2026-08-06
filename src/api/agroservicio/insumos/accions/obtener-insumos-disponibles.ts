import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { AgroInsumo } from "../interfaces/response-agro-insumos.interface";

export const ObtenerInsumosDisponibles = async (propietarioId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro_insumos/insumos-disponibles/${propietarioId}`;
  const response = await veterinariaAPI.get<AgroInsumo[]>(url);
  return response.data;
};

export default ObtenerInsumosDisponibles;
