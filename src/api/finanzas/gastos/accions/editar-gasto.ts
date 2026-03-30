import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearGastoInterface } from "../interface/crear-gasto.interface";

export const EditarGasto = async (
  id: string,
  data: Partial<CrearGastoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/gastos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
