import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPlanillaInterface } from "../interfaces/crear-planilla.interface";

export const EditarPlanilla = async (
  id: string,
  data: Partial<CrearPlanillaInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/planilla-trabajadores/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
