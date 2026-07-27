import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { MovimientosInvInterface } from "../interface/obtener-movimientos-inventario.interface";
import { MovimientosInvFilters } from "../../lotes/accions/obtener-lotes-sucursal";

export const obtenerMovimientosInventario = async (
  propietarioId: string,
  filters?: MovimientosInvFilters,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/movimientos-inventario/agroservicio/${propietarioId}`;
  const response = await veterinariaAPI.get<MovimientosInvInterface>(url, {
    params: filters,
  });
  return response.data;
};
