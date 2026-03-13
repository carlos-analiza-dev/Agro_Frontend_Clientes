import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseAlimentacionInterface } from "../interface/response-alimentacion.interface";

export const ObtenerAlimentacionAnimales = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/alimentacion-animal`;

  const response =
    await veterinariaAPI.get<ResponseAlimentacionInterface[]>(url);

  return response.data;
};
