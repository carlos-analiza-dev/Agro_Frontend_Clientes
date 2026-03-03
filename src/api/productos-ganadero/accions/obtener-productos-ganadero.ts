import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProductosVenta } from "../interfaces/obtener-productos-precios.interface";

export const ObtenerProductosGanadero = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/productos-ganaderia`;

  const response = await veterinariaAPI.get<ResponseProductosVenta[]>(url);
  return response.data;
};
