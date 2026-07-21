import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearImpuestoInterface } from "../interfaces/crear-impuesto.interface";

export const CrearImpueto = async (data: CrearImpuestoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/taxes-pais`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
