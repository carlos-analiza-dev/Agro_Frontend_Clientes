import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPlanillaInterface } from "../interfaces/crear-planilla.interface";

export const CrearPlanilla = async (data: CrearPlanillaInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/planilla-trabajadores`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
