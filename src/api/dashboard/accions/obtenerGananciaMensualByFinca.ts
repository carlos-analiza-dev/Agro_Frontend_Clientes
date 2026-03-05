import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { GananciaPesoFincaInterface } from "../interfaces/ganancia-peso-finca-prom.interface";

export const ObtenerGananciaMensualByFinca = async (
  fincaId: string,
  year: number,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/ganancia-mensual-finca/${fincaId}/${year}`;

  const response = await veterinariaAPI.get<GananciaPesoFincaInterface[]>(url);
  return response.data;
};
