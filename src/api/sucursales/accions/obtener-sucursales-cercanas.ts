import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseSucursalesCercanas } from "../interfaces/response-sucursales-cercanas.interface";

export const ObtenerSucursalesCercanas = async (lat: number, lon: number) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sucursales/cercanas?latitud=${lat}&longitud=${lon}&limite=5&usarGoogleMaps=true`;

  const response = await veterinariaAPI.get<ResponseSucursalesCercanas[]>(url);
  return response.data;
};
