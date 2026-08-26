import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export interface IngresarCodigoInterface {
  codigo: string;
}

export const ingresarCodigoCliente = async (data: IngresarCodigoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/codigos-paquetes/asignar`;
  const response = await veterinariaAPI.post(url, data);

  return response.data;
};
