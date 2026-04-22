import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

interface Pago {
  detalleId: string;
  metodoPago: string;
}

export const PagarPlanilla = async (id: string, pagos: Pago[]) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/planilla-trabajadores/${id}/pagos`;

  const response = await veterinariaAPI.post(url, { pagos });
  return response;
};
