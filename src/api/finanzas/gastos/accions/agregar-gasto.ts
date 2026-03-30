import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearGastoInterface } from "../interface/crear-gasto.interface";

export const AgregarNuevoGasto = async (data: CrearGastoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/gastos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
