import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import {
  CalcularRangoPesoInterface,
  ResponseRangoEdad,
} from "../interfaces/calcular-rango-peso.interface";

export const CalcularPesoPromedio = async (
  data: CalcularRangoPesoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/peso-esperado-raza/calcular-rango`;

  const response = await veterinariaAPI.post<ResponseRangoEdad>(url, data);
  return response.data;
};
