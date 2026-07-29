import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearRangoAgroInterface } from "../interface/crear-agro-rango.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const editarAgroRangosFactura = async (
  id: string,
  data: Partial<CrearRangoAgroInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-rango-factura/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};

export const editarAgroRangosFacturaEmpleado = async (
  id: string,
  data: Partial<CrearRangoAgroInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-rango-factura/empleado/${id}`;
  const respose = await empleadosAPI.patch(url, data);
  return respose;
};
