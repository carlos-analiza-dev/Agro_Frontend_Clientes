import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseHistorialAnimal } from "../interfaces/obtener-historial-pesos-animal.interface";

export const ObtenerHistorialPesos = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/peso-historial/animal/${id}`;

  const response = await veterinariaAPI.get<ResponseHistorialAnimal[]>(url);
  return response.data;
};
