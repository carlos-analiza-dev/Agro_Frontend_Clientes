import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const GenerarPlanilla = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/planilla-trabajadores/${id}/generar`;

  const response = await veterinariaAPI.post(url, {});
  return response;
};
