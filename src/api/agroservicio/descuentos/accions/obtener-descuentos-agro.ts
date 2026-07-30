import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseDescuentosAgroInterface } from "../interface/response-descuentos-agro.interface";

export const obtenerDescuentosAgro = async (propietarioId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-agro-clientes/agroservicio/${propietarioId}`;

  const response =
    await veterinariaAPI.get<ResponseDescuentosAgroInterface[]>(url);
  return response.data;
};
