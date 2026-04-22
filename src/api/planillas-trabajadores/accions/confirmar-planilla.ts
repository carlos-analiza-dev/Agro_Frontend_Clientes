import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const ConfirmarPlanilla = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/planilla-trabajadores/${id}/confirmar`;

  const response = await veterinariaAPI.post(url, {});
  return response;
};
