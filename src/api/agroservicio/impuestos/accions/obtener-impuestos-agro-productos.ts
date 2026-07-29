import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ImpuestosAgroProductosInterface } from "../interface/response-impuestos-agroservicio.interface";

export const obtenerImpuestosAgroProductos = async (propietarioId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-impuestos/agroservicio/${propietarioId}`;

  const response =
    await veterinariaAPI.get<ImpuestosAgroProductosInterface[]>(url);
  return response.data;
};
