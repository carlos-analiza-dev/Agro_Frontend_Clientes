import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const AnularPlanilla = async (id: string, motivo: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/planilla-trabajadores/${id}/anular`;

  const response = await veterinariaAPI.post(url, { motivo });
  return response;
};
