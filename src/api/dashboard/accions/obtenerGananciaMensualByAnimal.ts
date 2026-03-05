import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { GananciaAnimalMesInterface } from "../interfaces/ganancia-animal-mes.interface";

export const ObtenerGananciaMensualAnimal = async (
  animalId: string,
  year: number,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/ganancia-mensual/${animalId}/${year}`;

  const response = await veterinariaAPI.get<GananciaAnimalMesInterface[]>(url);
  return response.data;
};
