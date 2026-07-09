import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseDescartesEspecie } from "../../interfaces/produccion/response-descartes.interface";

export const obtenerMortalidadPorEspecie = async (mes?: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/mortalidad-animal?mes=${mes}`;

  const response = await veterinariaAPI.get<ResponseDescartesEspecie[]>(url);
  return response.data;
};
